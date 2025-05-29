/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/payment_processor.json`.
 */
export type PaymentProcessor = {
  "address": "8D6DNFXjHFDG2Lgaw84uh111YxtYpJ3yaJJehRpbjt83",
  "metadata": {
    "name": "paymentProcessor",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "docs": [
        "One-time program initialization by the admin."
      ],
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "pay",
      "docs": [
        "Pay for a prompt (or any other registered operation)."
      ],
      "discriminator": [
        119,
        18,
        216,
        65,
        192,
        117,
        122,
        220
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "operation",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "paymentType"
              }
            ]
          }
        },
        {
          "name": "userPaymentToken",
          "writable": true
        },
        {
          "name": "agentWallet"
        },
        {
          "name": "receiverToken",
          "writable": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "paymentType",
          "type": "u64"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "paymentId",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "setOperation",
      "docs": [
        "Register or update an operation that users can purchase."
      ],
      "discriminator": [
        41,
        217,
        83,
        153,
        61,
        159,
        14,
        101
      ],
      "accounts": [
        {
          "name": "globalConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "operation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "paymentType"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "globalConfig"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "paymentType",
          "type": "u64"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "paymentAmount",
          "type": "u64"
        },
        {
          "name": "acceptedMint",
          "type": "pubkey"
        },
        {
          "name": "agentToken",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalConfig",
      "discriminator": [
        149,
        8,
        156,
        202,
        160,
        252,
        176,
        217
      ]
    },
    {
      "name": "operation",
      "discriminator": [
        171,
        150,
        196,
        17,
        229,
        166,
        58,
        44
      ]
    }
  ],
  "events": [
    {
      "name": "operationAdded",
      "discriminator": [
        224,
        26,
        119,
        89,
        98,
        218,
        246,
        253
      ]
    },
    {
      "name": "operationPaid",
      "discriminator": [
        247,
        218,
        172,
        190,
        170,
        18,
        145,
        99
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unsupportedMint",
      "msg": "Unsupported payment token mint"
    },
    {
      "code": 6001,
      "name": "nameTooLong",
      "msg": "Operation name longer than 64 bytes"
    },
    {
      "code": 6002,
      "name": "wrongReceiver",
      "msg": "Receiver token authority does not match agent wallet"
    },
    {
      "code": 6003,
      "name": "priceMismatch",
      "msg": "Provided price does not match operation price"
    },
    {
      "code": 6004,
      "name": "unauthorized",
      "msg": "Caller is not authorized to modify the global config"
    }
  ],
  "types": [
    {
      "name": "globalConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "operation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paymentType",
            "type": "u64"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "paymentAmount",
            "type": "u64"
          },
          {
            "name": "acceptedMint",
            "type": "pubkey"
          },
          {
            "name": "agentToken",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "operationAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "paymentAmount",
            "type": "u64"
          },
          {
            "name": "agentToken",
            "type": "pubkey"
          },
          {
            "name": "caller",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "operationPaid",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paymentType",
            "type": "u64"
          },
          {
            "name": "paymentMint",
            "type": "pubkey"
          },
          {
            "name": "paymentId",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "paymentAmount",
            "type": "u64"
          },
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "agentWallet",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
