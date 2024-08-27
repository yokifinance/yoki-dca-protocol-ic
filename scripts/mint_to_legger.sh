set -x

## Transfer some ICP tokens to II Priccipal
II_PRINCIPAL="5whpp-p2ree-gb5r6-f3wuz-7ctgy-7z47n-qjhvx-wsg7b-ftcpq-eiyhe-iqe"
dfx identity use artem
dfx canister call icp_ledger_canister icrc1_transfer "(record 
    { to = 
        record { owner = principal \"${II_PRINCIPAL}\"; subaccount = null }; 
    amount = 3_00_000_000 
    }
)"