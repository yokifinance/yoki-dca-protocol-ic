import Error "mo:base/Error";

module {
    public type DepositArgs = {
        fee : Nat;
        token : Text;
        amount : Nat;
    };
    public type WithdrawArgs = {
        fee : Nat;
        token : Text;
        amount : Nat;
    };
    public type SwapArgs = {
        amountIn : Text;
        zeroForOne : Bool;
        amountOutMinimum : Text;
    };

    public type Result = { #ok : Nat64; #err : Text };

    public type Result_7 = {
        #Ok : { balance0 : Nat; balance1 : Nat };
        #Err : Text;
    };

    public type Self = actor {
        deposit : shared DepositArgs -> async Result;
        swap : shared SwapArgs -> async Result;
        withdraw : shared WithdrawArgs -> async Result;
    };
};
