import Principal "mo:base/Principal";
import { test; suite } "mo:test/async";
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
var defaultPrincipal : Principal = Principal.fromText("aaaaa-aa");

let whoamiHelper = await Whoami();

await suite(
    "DCA Position suite",
    func() : async () {

        type Result<A, B> = Result.Result<A, B>;

        let testPosition : T.Position = {
            beneficiary = defaultPrincipal;
            amountToSell = 1;
            tokenToBuy = ckBTCLedger;
            tokenToSell = icpLedger;
            frequency = #Daily;
        };

        let testSuiteCallerPrincipal = await whoamiHelper.getCaller();

        await test(
            "test openPosition",
            func() : async () {
                let res = await dca.openPosition(testPosition);
                assert res == 0;
            },
        );
        await test(
            "test getPosition positive case",
            func() : async () {

                let res = await dca.getPosition(testSuiteCallerPrincipal, 0);
                assert Result.isOk(res);

                switch (res) {
                    case (#ok(position)) {
                        assert position.beneficiary == testPosition.beneficiary;
                        assert position.amountToSell == testPosition.amountToSell;
                        assert position.tokenToBuy == testPosition.tokenToBuy;
                        assert position.tokenToSell == testPosition.tokenToSell;
                        assert position.frequency == testPosition.frequency;
                    };
                    case (_) {};
                };
            },
        );
        await test(
            "test getPosition negative case - wrong index",
            func() : async () {

                let res = await dca.getPosition(testSuiteCallerPrincipal, 1);
                assert Result.isErr(res);
            },
        );
        await test(
            "test getPosition negative case - unkown principal",
            func() : async () {

                let res = await dca.getPosition(defaultPrincipal, 1);
                assert Result.isErr(res);
            },
        );
        await test(
            "test readAllPositions positive case",
            func() : async () {
                let res = await dca.readAllPositions(testSuiteCallerPrincipal);
                switch (res) {
                    case (#ok(res)) {
                        assert res.size() == 1;
                    };
                    case (_) {};
                };
            },
        );
        await test(
            "test readAllPositions negative case - unkown principal",
            func() : async () {
                let res = await dca.readAllPositions(defaultPrincipal);
                assert Result.isErr(res);
            },
        );
        await test(
            "test closePosition positive case",
            func() : async () {
                let res = await dca.closePosition(testSuiteCallerPrincipal, 0);
                assert Result.isOk(res);
            },

        );
        await test(
            "test closePosition negative case - wrong index",
            func() : async () {
                let res = await dca.closePosition(testSuiteCallerPrincipal, 1);
                assert Result.isErr(res);
            },
        );
        await test(
            "test closePosition negative case - unknown principal",
            func() : async () {
                let res = await dca.closePosition(defaultPrincipal, 0);
                assert Result.isErr(res);
            },
        );
    },
);
