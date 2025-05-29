import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import idl from "./idl/payment_processor.json";
import type {
    PaymentProcessor,
} from "./idl/payment_processor";

export default {
    idlJson: idl,
    idlType: null as unknown as PaymentProcessor,

    create(provider: anchor.Provider, program: Program<PaymentProcessor>) {
        const payer = provider.publicKey!;
        const GLOBAL_CONFIG_SEED = "global-config";
        const OPERATION_SEED = "operation";

        function getGlobalConfigPda(): [PublicKey, number] {
            return PublicKey.findProgramAddressSync(
                [Buffer.from(GLOBAL_CONFIG_SEED)],
                program.programId,
            );
        }

        function getOperationPda(paymentType: number): [PublicKey, number] {
            return PublicKey.findProgramAddressSync(
                [
                    Buffer.from(OPERATION_SEED),
                    new anchor.BN(paymentType).toArrayLike(Buffer, "le", 8),
                ],
                program.programId,
            );
        }

        async function initialize(newAdmin: PublicKey): Promise<{ signature: string; globalConfigPda: PublicKey }> {
            const [globalConfigPda] = getGlobalConfigPda();

            const signature = await program.methods
                .initialize(newAdmin)
                .accountsStrict({
                    globalConfig: globalConfigPda,
                    admin: payer,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            return { signature, globalConfigPda };
        }

        async function setOperation(args: {
            paymentType: number;
            name: string;
            paymentAmount: anchor.BN;
            acceptedMint: PublicKey;
            agentToken: PublicKey;
        }): Promise<{ signature: string; operationPda: PublicKey }> {
            const [operationPda] = getOperationPda(args.paymentType);
            const [globalConfigPda] = getGlobalConfigPda();

            const signature = await program.methods
                .setOperation(
                    new anchor.BN(args.paymentType),
                    args.name,
                    args.paymentAmount,
                    args.acceptedMint,
                    args.agentToken,
                )
                .accountsStrict({
                    globalConfig: globalConfigPda,
                    operation: operationPda,
                    admin: payer,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            return { signature, operationPda };
        }

        async function pay(args: {
            paymentType: number;
            price: anchor.BN | number;
            agentWallet: PublicKey;
            paymentId: Uint8Array | number[] | Buffer;
            userPaymentToken?: PublicKey;
            receiverToken?: PublicKey;
        }): Promise<{ signature: string }> {
            const { operation } = await getOperation(args.paymentType);
            if (!operation) throw new Error("Operation not found");

            const acceptedMint = operation.acceptedMint as PublicKey;
            const agentWallet = args.agentWallet;

            const userToken =
                args.userPaymentToken ??
                getAssociatedTokenAddressSync(acceptedMint, payer);

            const receiverToken =
                args.receiverToken ??
                getAssociatedTokenAddressSync(acceptedMint, agentWallet, true);

            const [globalConfigPda] = getGlobalConfigPda();
            const [operationPda] = getOperationPda(args.paymentType);

            const pid =
                Buffer.isBuffer(args.paymentId)
                    ? args.paymentId
                    : Buffer.from(args.paymentId);

            if (pid.length !== 32)
                throw new Error("paymentId must be exactly 32 bytes");

            const signature = await program.methods
                .pay(
                    new anchor.BN(args.paymentType),
                    new anchor.BN(args.price),
                    Array.from(pid) as number[],
                )
                .accountsStrict({
                    globalConfig: globalConfigPda,
                    operation: operationPda,
                    userPaymentToken: userToken,
                    agentWallet,
                    receiverToken,
                    payer,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .rpc();

            return { signature };
        }

        async function getGlobalConfig(): Promise<{
            globalConfigPda: PublicKey;
            globalConfig: any | null;
        }> {
            const [pda] = getGlobalConfigPda();
            try {
                const data = await program.account.globalConfig.fetch(pda);
                return { globalConfigPda: pda, globalConfig: data };
            } catch {
                return { globalConfigPda: pda, globalConfig: null };
            }
        }

        async function getOperation(paymentType: number) {
            const [pda] = getOperationPda(paymentType);
            try {
                const data = await program.account.operation.fetch(pda);
                return { operationPda: pda, operation: data };
            } catch {
                return { operationPda: pda, operation: null };
            }
        }

        async function getAllOperations(max = 20) {
            const out: { paymentType: number; data: any }[] = [];
            for (let i = 0; i < max; i++) {
                const { operation } = await getOperation(i);
                if (operation) out.push({ paymentType: i, data: operation });
            }
            return out;
        }

        return {
            getGlobalConfigPda,
            getOperationPda,
            initialize,
            setOperation,
            pay,
            getGlobalConfig,
            getOperation,
            getAllOperations,
        };
    },
};

export type { PaymentProcessor };

// Explicit named export for the SDK functions for proper typing
export const xyberPaymentProcessorSdk = {
    idlJson: idl,
    idlType: null as unknown as PaymentProcessor,
    create: (provider: anchor.Provider, program: Program<PaymentProcessor>) =>
        exports.default.create(provider, program),
};
