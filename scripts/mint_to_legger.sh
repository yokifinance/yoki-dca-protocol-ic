set -x

## Transfer some ICP tokens to II Priccipal
II_PRINCIPAL="foayp-ihjk4-ity6h-3b6oz-3yvdy-lzqp5-y2xnf-ggf2h-qhlo3-cnc2a-6qe"
dfx identity use artem
dfx canister call icp_ledger_canister icrc1_transfer "(record 
    { to = 
        record { owner = principal \"${II_PRINCIPAL}\"; subaccount = null }; 
    amount = 1_00_000_000 
    }
)"