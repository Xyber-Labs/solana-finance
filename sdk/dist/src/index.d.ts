import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import type { PaymentProcessor } from "./idl/payment_processor";
declare const _default: {
    idlJson: {
        address: string;
        metadata: {
            name: string;
            version: string;
            spec: string;
            description: string;
        };
        instructions: ({
            name: string;
            docs: string[];
            discriminator: number[];
            accounts: ({
                name: string;
                writable: boolean;
                pda: {
                    seeds: {
                        kind: string;
                        value: number[];
                    }[];
                };
                signer?: undefined;
                address?: undefined;
            } | {
                name: string;
                writable: boolean;
                signer: boolean;
                pda?: undefined;
                address?: undefined;
            } | {
                name: string;
                address: string;
                writable?: undefined;
                pda?: undefined;
                signer?: undefined;
            })[];
            args: {
                name: string;
                type: string;
            }[];
        } | {
            name: string;
            docs: string[];
            discriminator: number[];
            accounts: ({
                name: string;
                pda: {
                    seeds: ({
                        kind: string;
                        value: number[];
                        path?: undefined;
                    } | {
                        kind: string;
                        path: string;
                        value?: undefined;
                    })[];
                };
                writable?: undefined;
                signer?: undefined;
                address?: undefined;
            } | {
                name: string;
                writable: boolean;
                pda?: undefined;
                signer?: undefined;
                address?: undefined;
            } | {
                name: string;
                pda?: undefined;
                writable?: undefined;
                signer?: undefined;
                address?: undefined;
            } | {
                name: string;
                writable: boolean;
                signer: boolean;
                pda?: undefined;
                address?: undefined;
            } | {
                name: string;
                address: string;
                pda?: undefined;
                writable?: undefined;
                signer?: undefined;
            })[];
            args: ({
                name: string;
                type: string;
            } | {
                name: string;
                type: {
                    array: (string | number)[];
                };
            })[];
        } | {
            name: string;
            docs: string[];
            discriminator: number[];
            accounts: ({
                name: string;
                writable: boolean;
                pda: {
                    seeds: ({
                        kind: string;
                        value: number[];
                        path?: undefined;
                    } | {
                        kind: string;
                        path: string;
                        value?: undefined;
                    })[];
                };
                signer?: undefined;
                relations?: undefined;
                address?: undefined;
            } | {
                name: string;
                writable: boolean;
                signer: boolean;
                relations: string[];
                pda?: undefined;
                address?: undefined;
            } | {
                name: string;
                address: string;
                writable?: undefined;
                pda?: undefined;
                signer?: undefined;
                relations?: undefined;
            })[];
            args: {
                name: string;
                type: string;
            }[];
        })[];
        accounts: {
            name: string;
            discriminator: number[];
        }[];
        events: {
            name: string;
            discriminator: number[];
        }[];
        errors: {
            code: number;
            name: string;
            msg: string;
        }[];
        types: {
            name: string;
            type: {
                kind: string;
                fields: ({
                    name: string;
                    type: string;
                } | {
                    name: string;
                    type: {
                        array: (string | number)[];
                    };
                })[];
            };
        }[];
    };
    idlType: PaymentProcessor;
    create(provider: anchor.Provider, program: Program<PaymentProcessor>): {
        getGlobalConfigPda: () => [PublicKey, number];
        getOperationPda: (paymentType: number) => [PublicKey, number];
        initialize: (newAdmin: PublicKey) => Promise<{
            signature: string;
            globalConfigPda: PublicKey;
        }>;
        setOperation: (args: {
            paymentType: number;
            name: string;
            paymentAmount: anchor.BN;
            acceptedMint: PublicKey;
            agentToken: PublicKey;
        }) => Promise<{
            signature: string;
            operationPda: PublicKey;
        }>;
        pay: (args: {
            paymentType: number;
            price: anchor.BN | number;
            agentWallet: PublicKey;
            paymentId: Uint8Array | number[] | Buffer;
            userPaymentToken?: PublicKey;
            receiverToken?: PublicKey;
        }) => Promise<{
            signature: string;
        }>;
        getGlobalConfig: () => Promise<{
            globalConfigPda: PublicKey;
            globalConfig: any | null;
        }>;
        getOperation: (paymentType: number) => Promise<{
            operationPda: anchor.web3.PublicKey;
            operation: {
                paymentType: anchor.BN;
                name: string;
                paymentAmount: anchor.BN;
                acceptedMint: anchor.web3.PublicKey;
                agentToken: anchor.web3.PublicKey;
                bump: number;
            };
        } | {
            operationPda: anchor.web3.PublicKey;
            operation: null;
        }>;
        getAllOperations: (max?: number) => Promise<{
            paymentType: number;
            data: any;
        }[]>;
    };
};
export default _default;
export type { PaymentProcessor };
export declare const xyberPaymentProcessorSdk: {
    idlJson: {
        address: string;
        metadata: {
            name: string;
            version: string;
            spec: string;
            description: string;
        };
        instructions: ({
            name: string;
            docs: string[];
            discriminator: number[];
            accounts: ({
                name: string;
                writable: boolean;
                pda: {
                    seeds: {
                        kind: string;
                        value: number[];
                    }[];
                };
                signer?: undefined;
                address?: undefined;
            } | {
                name: string;
                writable: boolean;
                signer: boolean;
                pda?: undefined;
                address?: undefined;
            } | {
                name: string;
                address: string;
                writable?: undefined;
                pda?: undefined;
                signer?: undefined;
            })[];
            args: {
                name: string;
                type: string;
            }[];
        } | {
            name: string;
            docs: string[];
            discriminator: number[];
            accounts: ({
                name: string;
                pda: {
                    seeds: ({
                        kind: string;
                        value: number[];
                        path?: undefined;
                    } | {
                        kind: string;
                        path: string;
                        value?: undefined;
                    })[];
                };
                writable?: undefined;
                signer?: undefined;
                address?: undefined;
            } | {
                name: string;
                writable: boolean;
                pda?: undefined;
                signer?: undefined;
                address?: undefined;
            } | {
                name: string;
                pda?: undefined;
                writable?: undefined;
                signer?: undefined;
                address?: undefined;
            } | {
                name: string;
                writable: boolean;
                signer: boolean;
                pda?: undefined;
                address?: undefined;
            } | {
                name: string;
                address: string;
                pda?: undefined;
                writable?: undefined;
                signer?: undefined;
            })[];
            args: ({
                name: string;
                type: string;
            } | {
                name: string;
                type: {
                    array: (string | number)[];
                };
            })[];
        } | {
            name: string;
            docs: string[];
            discriminator: number[];
            accounts: ({
                name: string;
                writable: boolean;
                pda: {
                    seeds: ({
                        kind: string;
                        value: number[];
                        path?: undefined;
                    } | {
                        kind: string;
                        path: string;
                        value?: undefined;
                    })[];
                };
                signer?: undefined;
                relations?: undefined;
                address?: undefined;
            } | {
                name: string;
                writable: boolean;
                signer: boolean;
                relations: string[];
                pda?: undefined;
                address?: undefined;
            } | {
                name: string;
                address: string;
                writable?: undefined;
                pda?: undefined;
                signer?: undefined;
                relations?: undefined;
            })[];
            args: {
                name: string;
                type: string;
            }[];
        })[];
        accounts: {
            name: string;
            discriminator: number[];
        }[];
        events: {
            name: string;
            discriminator: number[];
        }[];
        errors: {
            code: number;
            name: string;
            msg: string;
        }[];
        types: {
            name: string;
            type: {
                kind: string;
                fields: ({
                    name: string;
                    type: string;
                } | {
                    name: string;
                    type: {
                        array: (string | number)[];
                    };
                })[];
            };
        }[];
    };
    idlType: PaymentProcessor;
    create: (provider: anchor.Provider, program: Program<PaymentProcessor>) => any;
};
