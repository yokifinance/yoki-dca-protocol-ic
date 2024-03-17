import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Types "types";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Map "mo:map/Map";
import { phash } "mo:map/Map";
import Debug "mo:base/Debug";
import Account "./Account";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";
import Array "mo:base/Array";
import Error "mo:base/Error";
import L "./Ledger";
import S "./Sonic";
import I "./ICSwap";
import Sonic "Sonic";

actor class DCA() = self {
    // DCA Types
    type Result<A, B> = Result.Result<A, B>;
    type PositionId = Types.PositionId;
    type Position = Types.Position;

    // Create HashMap to store a positions
    let positionsLedger = Map.new<Principal, Buffer.Buffer<Position>>();

    // Create ICP Ledger actor
    let Ledger = actor ("ryjl3-tyaaa-aaaaa-aaaba-cai") : actor {
        icrc1_transfer : shared L.TransferArg -> async L.Result<>;
        icrc2_approve : shared L.ApproveArgs -> async L.Result_1<>;
        icrc2_transfer_from : shared L.TransferFromArgs -> async L.Result_2<>;
        icrc1_balance_of : shared query L.Account -> async Nat;
    };

    // Create Sonic DEX actor actor
    let sonicCanister = actor ("3xwpq-ziaaa-aaaah-qcn4a-cai") : actor {
        getPair : shared query (Principal, Principal) -> async ?S.PairInfoExt;
        swapExactTokensForTokens : shared (
            Nat,
            Nat,
            [Text],
            Principal,
            Int,
        ) -> async S.TxReceipt;
        deposit : shared (Principal, Nat) -> async S.TxReceipt;
        withdraw : shared (Principal, Nat) -> async S.TxReceipt;
        initiateICRC1Transfer : shared () -> async Blob;
    };

    // Create ICP Swap ICP/ckBTC pool actor
    let ICPBTCpool = actor ("xmiu5-jqaaa-aaaag-qbz7q-cai") : actor {
        deposit : shared (I.DepositArgs) -> async I.Result;
        depositFrom : shared (I.DepositArgs) -> async I.Result;
        swap : shared (I.SwapArgs) -> async I.Result;
        getUserUnusedBalance : shared query (Principal) -> async I.Result_7;
        withdraw : shared (I.WithdrawArgs) -> async I.Result;
        applyDepositToDex: shared (I.DepositArgs) -> async I.Result

    };

    // // Method to create a new position
    public shared ({ caller }) func openPosition(newPosition : Position) : async PositionId {
        let currentPositions = switch (Map.get<Principal, Buffer.Buffer<Position>>(positionsLedger, phash, caller)) {
            case (null) {
                // Create new Buffer if it does not exist
                Buffer.Buffer<Position>(1);
            };
            case (?positions) {
                // Use existing Buffer if it exists
                positions;
            };
        };

        // add new position to the Buffer
        currentPositions.add(newPosition);

        // Save the Buffer to the Map
        ignore Map.put<Principal, Buffer.Buffer<Position>>(positionsLedger, phash, caller, currentPositions);
        currentPositions.size() - 1;
    };

    public query func readAllPositions(principal : Principal) : async Result<[Position], Text> {
        switch (Map.get<Principal, Buffer.Buffer<Position>>(positionsLedger, phash, principal)) {
            case (null) { return #err("Positions do not exist for this user") };
            case (?positions) {
                let positionsArray = Buffer.toArray<Position>(positions);
                return #ok(positionsArray);
            };
        };
    };

    public query func getPosition(principal : Principal, index : Nat) : async Result<Position, Text> {
        switch (Map.get<Principal, Buffer.Buffer<Position>>(positionsLedger, phash, principal)) {
            case (null) { return #err("Positions do not exist for this user") };
            case (?positions) {
                // use getOpt for safe getting position by index
                let position = positions.getOpt(index);
                switch (position) {
                    case (null) {
                        return #err("Position does not exist for this index");
                    };
                    case (?position) { return #ok(position) };
                };
            };
        };
    };

    public func closePosition(principal : Principal, index : Nat) : async Result<Text, Text> {
        switch (Map.get<Principal, Buffer.Buffer<Position>>(positionsLedger, phash, principal)) {
            case (null) { return #err("Positions do not exist for this user") };
            case (?positions) {
                // use getOpt for safe getting position by index
                let position = positions.getOpt(index);
                switch (position) {
                    case (null) {
                        return #err("Position does not exist for this index");
                    };
                    case (?position) {
                        ignore positions.remove(index);
                        return #ok("Position deleted");
                    };
                };
            };
        };

    };

    public func executePurchase(amount: Nat, deadline: Int) : async S.TxReceipt {
        let swap_result = await sonicCanister.swapExactTokensForTokens(
            amount,
            0,
            ["ryjl3-tyaaa-aaaaa-aaaba-cai", "mxzaz-hqaaa-aaaar-qaada-cai"],
            Principal.fromActor(self),
            deadline,
        );
    };

    private func _principalToBlob(p : Principal) : Blob {
        var arr : [Nat8] = Blob.toArray(Principal.toBlob(p));
        var defaultArr : [var Nat8] = Array.init<Nat8>(32, 0);
        defaultArr[0] := Nat8.fromNat(arr.size());
        var ind : Nat = 0;
        while (ind < arr.size() and ind < 32) {
            defaultArr[ind + 1] := arr[ind];
            ind := ind + 1;
        };
        return Blob.fromArray(Array.freeze(defaultArr));
    };

    public shared func depositToSonic(amount : Nat) : async Result<Nat, L.TransferError> {
        let sonicSubaccount = await sonicCanister.initiateICRC1Transfer();
        let to = Principal.fromActor(sonicCanister);
        let sendIcpToDexResult = await _sendIcp(to, amount, ?sonicSubaccount);
        return sendIcpToDexResult;
    };

    public shared func depositToICSwap(amount : Nat) : async Result<Nat, L.TransferError> {
        let sendIcpToICSwapResult = await _sendIcp(Principal.fromActor(ICPBTCpool), amount, ?_principalToBlob(Principal.fromActor(self)));
        return sendIcpToICSwapResult;
    };

    public shared func checkSonicBalance() : async Nat {
        let sonicSubbacount = await sonicCanister.initiateICRC1Transfer();
        let sonicBalance = await Ledger.icrc1_balance_of({
            owner = Principal.fromActor(sonicCanister);
            subaccount = ?sonicSubbacount;
        });
        return sonicBalance;
    };

    public shared func applyDepositToDex(amount: Nat, token: Text) : async I.Result {
        let applyDepositResult = await ICPBTCpool.deposit({amount = amount; fee = 10_000; token = token});
        return applyDepositResult;
    };

    // only for Development
    public shared ({ caller }) func withdraw(amount : Nat, address : Principal) : async Result<Nat, L.TransferError> {
        assert caller == Principal.fromText("hfugy-ahqdz-5sbki-vky4l-xceci-3se5z-2cb7k-jxjuq-qidax-gd53f-nqe");
        await _sendIcp(address, amount, null);
    };

    private func _sendIcp(address : Principal, amount : Nat, subaccount : ?Blob) : async Result<Nat, L.TransferError> {
        Debug.print("Sending ICP to:" # Principal.toText(address));

        // Transfer from this Canister to an address
        let icp_reciept = await Ledger.icrc1_transfer({
            amount = amount;
            to = { owner = address; subaccount = subaccount };
            from_subaccount = null;
            memo = null;
            fee = ?10_000; // default ICP fee
            created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
        });

        switch icp_reciept {
            case (#Err(error)) {
                return #err(error);
            };
            case (#Ok(value)) {
                return #ok(value);
            };
        };
    };

    // only for Admin
    public shared func approve(amount : Nat, to : Principal) : async Result<Nat, L.ApproveError> {
        await _setApprove(amount, to);
    };

    private func _setApprove(ammountToSell : Nat, to : Principal) : async Result<Nat, L.ApproveError> {

        let approve = await Ledger.icrc2_approve({
            amount = ammountToSell;
            created_at_time = null;
            expected_allowance = null;
            expires_at = null;
            fee = null;
            from_subaccount = null;
            memo = null;
            spender = {
                owner = to;
                subaccount = null;
            };
        });
        switch approve {
            case (#Err(error)) {
                return #err(error);
            };
            case (#Ok(value)) {
                return #ok(value);
            };
        };
    };

};
