import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import Result "mo:base/Result";
module {

    // Define the structure of a position
    public type Position = {
        beneficiary : Principal;
        amountToSell : Nat;
        tokenToBuy : Principal;
        tokenToSell : Principal;
        frequency : Frequency;
        nextRunTime: ?Time.Time;
        lastPurchaseResult: Result.Result<Text, Text>;
    };

    public type Frequency = {
        #Daily;
        #Weekly;
        #Monthly;
    };

    public type PositionId = Nat;

    public type Result = {
        #ok : Nat;
        #err : Error;
    };

    public type TimerActionType = {
        #StartTimer;
        #StopTimer;
    };

};
