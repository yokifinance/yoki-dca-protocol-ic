# Yoki DCA canister

## Description

With this project you can create an executable DCA financial strategy

### Local development

## Step 1. Deploying ICP Ledger and ckBTC Ledger

```bash
bash scripts/deploy_icp_ledger.sh
```
```bash
bash scripts/deploy_icrc1_ledger.sh
```
## Step 2. deploy **dca_backend** canister
```bash
1. dfx deploy dca_backend
```

## Step 3. Creating a DCA strategy for swap ICP to ckBTC
Change the hfugy-ahqdz-5sbki-vky4l-xceci-3se5z-2cb7k-jxjuq-qidax-gd53f-nqe to your principal id who will receive swap result

```bash
dfx canister call dca_backend openPosition '(record { tokenToSell = principal "ryjl3-tyaaa-aaaaa-aaaba-cai"; tokenToBuy = principal "mxzaz-hqaaa-aaaar-qaada-cai"; beneficiary = principal "hfugy-ahqdz-5sbki-vky4l-xceci-3se5z-2cb7k-jxjuq-qidax-gd53f-nqe"; amountToSell = 30_000; frequency = variant {Daily} })'
```

## Step 4. Set Approve to DCA canister

```bash
dfx canister call ryjl3-tyaaa-aaaaa-aaaba-cai  icrc2_approve "(record { amount = 40_000; spender = record{owner = principal \"up2ak-nqaaa-aaaap-qccia-cai\";} })"
```

## Step 5. Execute Position from worker
```bash
dfx canister call bd3sg-teaaa-aaaaa-qaaba-cai executePosition "(principal \"ck7ps-dw2lz-7f2oo-lnkx3-mkndn-g2rva-6fxc7-ctsir-xi5vu-fuor3-fqe\", 0)"
```