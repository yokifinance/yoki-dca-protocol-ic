# Yoki DCA canister

## Description:

With this project you can create an executable DCA financial strategy in ICP (Internet Computer Protocol) ecosystem.


## Limitations:
- Currently supports only direct canister interactions without front-end
- Token for sell - ICP
- Token to buy - ckBTC 


## Prerequisites:

* Installed [dfx SDK](https://internetcomputer.org/docs/current/developer-docs/getting-started/install#installing-dfx-via-dfxvm) to interact with ICP blockchain from CLI
* Some [ICP coin](https://coinmarketcap.com/currencies/internet-computer/) on your principal-id  



## Mainnet interactions


| Canister type | Canister id | Stage |
|---------------|-------------|-------|
| DCA backend   | up2ak-nqaaa-aaaap-qccia-cai | Mainnet |


### Step 1. Set Approve to DCA canister

This call make future transfer from your wallet possible without any additional actions

```bash
dfx canister call ryjl3-tyaaa-aaaaa-aaaba-cai  icrc2_approve '(record { amount = 40_000; spender = record{owner = principal "up2ak-nqaaa-aaaap-qccia-cai";} })' --ic
```

CLI result
```
(variant { Ok = 12_141_598 : nat })
```

### Step 2. Creating a DCA strategy for swaping ICP to ckBTC


**beneficiary** change this valuse to your principal id who will receive swap result

**tokenToSell** ryjl3-tyaaa-aaaaa-aaaba-cai - its [ICP  Canister ID](https://dashboard.internetcomputer.org/canister/ryjl3-tyaaa-aaaaa-aaaba-cai)

**tokenToBuy** mxzaz-hqaaa-aaaar-qaada-cai - its 
[ckBTC Canister ID](https://dashboard.internetcomputer.org/canister/mxzaz-hqaaa-aaaar-qaada-cai)

**frequency** - one of (Daily, Weekly, Monthly)



CLI command to create DCA strategy:
```bash
dfx canister call up2ak-nqaaa-aaaap-qccia-cai  openPosition '(record { tokenToSell = principal "ryjl3-tyaaa-aaaaa-aaaba-cai"; tokenToBuy = principal "mxzaz-hqaaa-aaaar-qaada-cai"; beneficiary = principal "hfugy-ahqdz-5sbki-vky4l-xceci-3se5z-2cb7k-jxjuq-qidax-gd53f-nqe"; amountToSell = 30_000; frequency = variant {Daily} })' --ic
```

CLI result
```bash
(variant { ok = 0 : nat })
```

## Step 3. Wait some time and receive ckBTC
Right after creation, your position will be executed for the first time (usually it takes around 3 minutes). The date of the second purchase depends on the **frequency** field from the Position



## Local development

### Step 1. Deploying ICP Ledger and ckBTC Ledger

##### Edit deploy_local.sh to change DEFAULT_IDENTITY to your identity before run
```bash
bash scripts/deploy_local.sh
```
### Step 2. deploy **dca_backend** canister
```bash
1. dfx deploy dca_backend
```

### Step 3. Set Approve to DCA canister

```bash
dfx canister call ryjl3-tyaaa-aaaaa-aaaba-cai  icrc2_approve '(record { amount = 40_000; spender = record{owner = principal "up2ak-nqaaa-aaaap-qccia-cai";} })'
```

### Step 4. Creating a DCA strategy for swaping ICP to ckBTC
Change the **hfugy-ahqdz-5sbki-vky4l-xceci-3se5z-2cb7k-jxjuq-qidax-gd53f-nqe** to your principal id who will receive swap result

```bash
dfx canister call dca_backend openPosition '(record { tokenToSell = principal "ryjl3-tyaaa-aaaaa-aaaba-cai"; tokenToBuy = principal "mxzaz-hqaaa-aaaar-qaada-cai"; beneficiary = principal "hfugy-ahqdz-5sbki-vky4l-xceci-3se5z-2cb7k-jxjuq-qidax-gd53f-nqe"; amountToSell = 30_000; frequency = variant {Daily} })'
```


## Status: Beta Version

This project is in the beta testing phase. We are actively working on adding new features and improving existing ones. Please be cautious as the software may contain bugs, and its stability is not guaranteed.

## Disclaimer

By using this project, you agree to do so at your own risk. The authors of the project are not responsible for any potential consequences of using this software.