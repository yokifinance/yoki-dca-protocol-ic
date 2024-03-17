#!/bin/bash
set -x

dfx start --background --clean

dfx identity new minter
dfx identity use minter
MINTER_ACCOUNT_ID=$(dfx ledger account-id)

dfx identity new default
dfx identity use default
DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)


dfx deploy icp_ledger_canister --specified-id ryjl3-tyaaa-aaaaa-aaaba-cai  --argument "(variant { Init = 
record {
      minting_account = \"${MINTER_ACCOUNT_ID}\";
      initial_values = vec {
        record {
          \"${DEFAULT_ACCOUNT_ID}\";
          record {
            e8s = 10_000_000_000 : nat64;
          };
        };
      };
      send_whitelist = vec {};
      transfer_fee = opt record {
        e8s = 10_000 : nat64;
      };
      token_symbol = opt \"ICP\";
      token_name = opt \"Local ICP\";
    }
})"