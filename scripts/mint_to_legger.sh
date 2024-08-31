set -x

## Transfer some ICP tokens to II Priccipal
II_PRINCIPAL="bz4wn-ma635-pnppu-byehk-dpjqk-s6l3r-nnnrq-ovg5h-fu6mq-74er4-3ae"
dfx identity use artem
dfx canister call icp_ledger_canister icrc1_transfer "(record 
    { to = 
        record { owner = principal \"${II_PRINCIPAL}\"; subaccount = null }; 
    amount = 3_00_000_000 
    }
)"