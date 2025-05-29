#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("8D6DNFXjHFDG2Lgaw84uh111YxtYpJ3yaJJehRpbjt83");

#[program]
pub mod payment_processor {
    use super::*;

    /// One-time program initialization by the admin.
    pub fn initialize(ctx: Context<Initialize>, new_admin: Pubkey) -> Result<()> {
        let cfg = &mut ctx.accounts.global_config;
        // Allow re-initialization only by the current admin
        if cfg.admin != Pubkey::default() {
            require_keys_eq!(
                cfg.admin,
                ctx.accounts.admin.key(),
                XyberError::Unauthorized
            );
        }
        cfg.admin = new_admin;
        cfg.bump = ctx.bumps.global_config;
        Ok(())
    }

    /// Register or update an operation that users can purchase.
    pub fn set_operation(
        ctx: Context<SetOperation>,
        payment_type: u64,
        name: String,
        payment_amount: u64,
        accepted_mint: Pubkey,
        agent_token: Pubkey,
    ) -> Result<()> {
        require!(name.len() <= 64, XyberError::NameTooLong);

        let operation = &mut ctx.accounts.operation;
        operation.payment_type = payment_type;
        operation.name = name.clone();
        operation.payment_amount = payment_amount;
        operation.accepted_mint = accepted_mint;
        operation.agent_token = agent_token;
        operation.bump = ctx.bumps.operation;

        emit!(OperationAdded {
            name,
            payment_amount,
            agent_token,
            caller: ctx.accounts.admin.key(),
        });
        Ok(())
    }

    /// Pay for a prompt (or any other registered operation).
    pub fn pay(ctx: Context<Pay>, payment_type: u64, price: u64, payment_id: [u8; 32]) -> Result<()> {
        let op = &ctx.accounts.operation;

        require_keys_eq!(ctx.accounts.user_payment_token.mint, op.accepted_mint, XyberError::UnsupportedMint);
        require_keys_eq!(ctx.accounts.receiver_token.mint, op.accepted_mint, XyberError::UnsupportedMint);

        require!(price == op.payment_amount, XyberError::PriceMismatch);
        require_keys_eq!(
            ctx.accounts.receiver_token.owner,
            ctx.accounts.agent_wallet.key(),
            XyberError::WrongReceiver
        );
        let amount = price;

        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_payment_token.to_account_info(),
                to: ctx.accounts.receiver_token.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, amount)?;

        emit!(OperationPaid {
            payment_type,
            payment_mint: op.accepted_mint,
            payment_id,
            payment_amount: amount,
            payer: ctx.accounts.payer.key(),
            agent_wallet: ctx.accounts.agent_wallet.key(),
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        seeds = [b"global-config"],
        bump,
        payer = admin,
        space = 8 + GlobalConfig::SIZE,
    )]
    pub global_config: Account<'info, GlobalConfig>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(payment_type: u64)]
pub struct SetOperation<'info> {
    #[account(
        mut,
        seeds = [b"global-config"],
        bump = global_config.bump,
        has_one = admin,
    )]
    pub global_config: Account<'info, GlobalConfig>,

    #[account(
        init_if_needed,
        payer = admin,
        seeds = [b"operation", payment_type.to_le_bytes().as_ref()],
        bump,
        space = 8 + Operation::SIZE,
    )]
    pub operation: Account<'info, Operation>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(payment_type: u64)]
pub struct Pay<'info> {
    #[account(
        seeds = [b"global-config"],
        bump = global_config.bump,
    )]
    pub global_config: Account<'info, GlobalConfig>,

    #[account(
        seeds = [b"operation", payment_type.to_le_bytes().as_ref()],
        bump = operation.bump,
    )]
    pub operation: Account<'info, Operation>,

    #[account(
        mut,
        token::mint = operation.accepted_mint,
        token::authority = payer,
    )]
    pub user_payment_token: Account<'info, TokenAccount>,

    /// CHECK: Wallet that will receive the payment
    pub agent_wallet: UncheckedAccount<'info>,

    #[account(
        mut,
        token::mint = operation.accepted_mint,
    )]
    pub receiver_token: Account<'info, TokenAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

#[account]
pub struct GlobalConfig {
    pub admin: Pubkey,
    pub bump: u8
}

impl GlobalConfig {
    const SIZE: usize = 32 + 1;
}

#[account]
pub struct Operation {
    pub payment_type: u64,
    pub name: String,
    pub payment_amount: u64,
    pub accepted_mint: Pubkey,
    pub agent_token: Pubkey,
    pub bump: u8,
}

impl Operation {
    pub const SIZE: usize = 200;
}

#[event]
pub struct OperationPaid {
    pub payment_type: u64,
    pub payment_mint: Pubkey,
    pub payment_id: [u8; 32],
    pub payment_amount: u64,
    pub payer: Pubkey,
    pub agent_wallet: Pubkey,
}

#[event]
pub struct OperationAdded {
    pub name: String,
    pub payment_amount: u64,
    pub agent_token: Pubkey,
    pub caller: Pubkey,
}

#[error_code]
pub enum XyberError {
    #[msg("Unsupported payment token mint")]
    UnsupportedMint,
    #[msg("Operation name longer than 64 bytes")]
    NameTooLong,
    #[msg("Receiver token authority does not match agent wallet")]
    WrongReceiver,
    #[msg("Provided price does not match operation price")]
    PriceMismatch,
    #[msg("Caller is not authorized to modify the global config")]
    Unauthorized,
}
