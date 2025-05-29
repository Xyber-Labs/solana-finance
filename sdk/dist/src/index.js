"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xyberPaymentProcessorSdk = void 0;
const anchor = __importStar(require("@coral-xyz/anchor"));
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const payment_processor_json_1 = __importDefault(require("./idl/payment_processor.json"));
exports.default = {
    idlJson: payment_processor_json_1.default,
    idlType: null,
    create(provider, program) {
        const payer = provider.publicKey;
        const GLOBAL_CONFIG_SEED = "global-config";
        const OPERATION_SEED = "operation";
        function getGlobalConfigPda() {
            return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_CONFIG_SEED)], program.programId);
        }
        function getOperationPda(paymentType) {
            return web3_js_1.PublicKey.findProgramAddressSync([
                Buffer.from(OPERATION_SEED),
                new anchor.BN(paymentType).toArrayLike(Buffer, "le", 8),
            ], program.programId);
        }
        function initialize(newAdmin) {
            return __awaiter(this, void 0, void 0, function* () {
                const [globalConfigPda] = getGlobalConfigPda();
                const signature = yield program.methods
                    .initialize(newAdmin)
                    .accountsStrict({
                    globalConfig: globalConfigPda,
                    admin: payer,
                    systemProgram: web3_js_1.SystemProgram.programId,
                })
                    .rpc();
                return { signature, globalConfigPda };
            });
        }
        function setOperation(args) {
            return __awaiter(this, void 0, void 0, function* () {
                const [operationPda] = getOperationPda(args.paymentType);
                const [globalConfigPda] = getGlobalConfigPda();
                const signature = yield program.methods
                    .setOperation(new anchor.BN(args.paymentType), args.name, args.paymentAmount, args.acceptedMint, args.agentToken)
                    .accountsStrict({
                    globalConfig: globalConfigPda,
                    operation: operationPda,
                    admin: payer,
                    systemProgram: web3_js_1.SystemProgram.programId,
                })
                    .rpc();
                return { signature, operationPda };
            });
        }
        function pay(args) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const { operation } = yield getOperation(args.paymentType);
                if (!operation)
                    throw new Error("Operation not found");
                const acceptedMint = operation.acceptedMint;
                const agentWallet = args.agentWallet;
                const userToken = (_a = args.userPaymentToken) !== null && _a !== void 0 ? _a : (0, spl_token_1.getAssociatedTokenAddressSync)(acceptedMint, payer);
                const receiverToken = (_b = args.receiverToken) !== null && _b !== void 0 ? _b : (0, spl_token_1.getAssociatedTokenAddressSync)(acceptedMint, agentWallet, true);
                const [globalConfigPda] = getGlobalConfigPda();
                const [operationPda] = getOperationPda(args.paymentType);
                const pid = Buffer.isBuffer(args.paymentId)
                    ? args.paymentId
                    : Buffer.from(args.paymentId);
                if (pid.length !== 32)
                    throw new Error("paymentId must be exactly 32 bytes");
                const signature = yield program.methods
                    .pay(new anchor.BN(args.paymentType), new anchor.BN(args.price), Array.from(pid))
                    .accountsStrict({
                    globalConfig: globalConfigPda,
                    operation: operationPda,
                    userPaymentToken: userToken,
                    agentWallet,
                    receiverToken,
                    payer,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                })
                    .rpc();
                return { signature };
            });
        }
        function getGlobalConfig() {
            return __awaiter(this, void 0, void 0, function* () {
                const [pda] = getGlobalConfigPda();
                try {
                    const data = yield program.account.globalConfig.fetch(pda);
                    return { globalConfigPda: pda, globalConfig: data };
                }
                catch (_a) {
                    return { globalConfigPda: pda, globalConfig: null };
                }
            });
        }
        function getOperation(paymentType) {
            return __awaiter(this, void 0, void 0, function* () {
                const [pda] = getOperationPda(paymentType);
                try {
                    const data = yield program.account.operation.fetch(pda);
                    return { operationPda: pda, operation: data };
                }
                catch (_a) {
                    return { operationPda: pda, operation: null };
                }
            });
        }
        function getAllOperations() {
            return __awaiter(this, arguments, void 0, function* (max = 20) {
                const out = [];
                for (let i = 0; i < max; i++) {
                    const { operation } = yield getOperation(i);
                    if (operation)
                        out.push({ paymentType: i, data: operation });
                }
                return out;
            });
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
// Explicit named export for the SDK functions for proper typing
exports.xyberPaymentProcessorSdk = {
    idlJson: payment_processor_json_1.default,
    idlType: null,
    create: (provider, program) => exports.default.create(provider, program),
};
