import Principal "mo:base/Principal";
import { test; suite; } "mo:test/async";
import DCA "../src/dca_backend/main";
import T "../src/dca_backend/types";
import Result "mo:base/Result";
import { expect } "mo:test";
import Debug "mo:base/Debug";
import Text "mo:base/Text";

actor class Whoami() {
    public query ({ caller }) func getCaller() : async Principal {
        caller;
    };
};

var dca = await DCA.DCA();
var icpLedger : Principal = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
var ckBTCLedger : Principal = Principal.fromText("mxzaz-hqaaa-aaaar-qaada-cai");
var serviceUser : Principal = Principal.fromText("aaaaa-aa");

let whoamiHelper = await Whoami();

await suite(
    "DCA Position suite",
    func() : async () {

        type Result<A, B> = Result.Result<A, B>;

        let testPosition : T.Position = {
            beneficiary = serviceUser; // Who will receive the tokens
            amountToSell = 1_00_000_000; // Euqal to 1 ICP
            tokenToBuy = ckBTCLedger; // The ckBTC token canister 
            tokenToSell = icpLedger; // The ICP token canister
            frequency = #Daily; // The frequency of the DCA
            purchasesLeft = 10; // The number of purchases left
            lastPurchaseResult = null;
            nextRunTime = null;
            purchaseHistory = null;
 
        };

        let brokentTestPosition : T.Position = {
            beneficiary = serviceUser; // Who will receive the tokens
            amountToSell = 0; // Euqal to 1 ICP
            tokenToBuy = ckBTCLedger; // The ckBTC token canister 
            tokenToSell = ckBTCLedger; // The ckBTC token canister
            frequency = #Daily; // The frequency of the DCA
            purchasesLeft = 0; // The number of purchases left
            lastPurchaseResult = null;
            nextRunTime = null;
            purchaseHistory = null;
 
        };

        let testSuiteCallerPrincipal = await whoamiHelper.getCaller();

        // Testing openPosition
        await test(
            "test openPosition with success", 
            func() : async () {
                let res = await dca.openPosition(testPosition);
                    assert Result.isOk(res);
        });
        await test(
            "test openPosition with fail", 
            func() : async () {
                let res = await dca.openPosition(brokentTestPosition);
                    assert Result.isErr(res);
        });

        // Testing getPosition
        await test(
            "test getPosition positive case",
            func() : async () {

                let res = await dca.getPosition(0);
                assert Result.isOk(res);

                switch (res) {
                    case (#ok(position)) {
                        assert position.beneficiary == testPosition.beneficiary;
                        assert position.amountToSell == testPosition.amountToSell;
                        assert position.tokenToBuy == testPosition.tokenToBuy;
                        assert position.tokenToSell == testPosition.tokenToSell;
                        assert position.frequency == testPosition.frequency;
                        assert position.purchasesLeft == testPosition.purchasesLeft;
                        assert position.nextRunTime == testPosition.nextRunTime;
                        assert position.lastPurchaseResult == testPosition.lastPurchaseResult;
                        assert position.purchaseHistory == testPosition.purchaseHistory;
                    };
                    case (_) {};
                };
            },
        );
        await test(
            "test getPosition negative case - wrong index",
            func() : async () {

                let res = await dca.getPosition(2);
                Debug.print(debug_show(res));
                assert Result.isErr(res);
            },
        );

        // #######################################################################
        // # Can'be reproduced with this test library #
        // await test(
        //     "test getPosition negative case - unkown principal",
        //     func() : async () {

        //         let res = await dca.getPosition(defaultPrincipal, 1);
        //         assert Result.isErr(res);
        //     },
        // );
        // #######################################################################

        await test(
            "test getAllPositions positive case",
            func() : async () {
                let res = await dca.getAllPositions();
                switch (res) {
                    case (#ok(res)) {
                        Debug.print(debug_show(res.size()));
                        assert res.size() == 1;
                    };
                    case (_) {};
                };
            },
        );

        // #######################################################################
        // # Can'be reproduced with this test library #
        // await test(
        //     "test getAllPositions negative case - unkown principal",
        //     func() : async () {
        //         let res = await dca.getAllPositions(defaultPrincipal);
        //         assert Result.isErr(res);
        //     },
        // );
        // #######################################################################

        await test(
            "test closePosition positive case",
            func() : async () {
                let res = await dca.closePosition(0);
                assert Result.isOk(res);
            },

        );
        await test(
            "test closePosition negative case - wrong index",
            func() : async () {
                let res = await dca.closePosition(5);
                assert Result.isErr(res);
            },
        );
        // #######################################################################
        // # Can'be reproduced with this test library #
        // await test(
        //     "test closePosition negative case - unknown principal",
        //     func() : async () {
        //         let res = await dca.closePosition(defaultPrincipal, 0);
        //         assert Result.isErr(res);
        //     },
        // );
        // #######################################################################
    },
);
