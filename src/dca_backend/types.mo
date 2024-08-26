import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
module {

    public type Result<A, B> = {
        #ok : A;
        #err : B;
    };

    // Define the structure of a position
    public type Position = {
        beneficiary : Principal;
        amountToSell : Nat;
        tokenToBuy : Principal;
        tokenToSell : Principal;
        frequency : Frequency;
        purchasesLeft : Int;
        nextRunTime: ?Time.Time;
        lastPurchaseResult: ?Result<Text, Text>;
        purchaseHistory: ?[Result<Text, Text>];
    };
    // Define the structure of a timer
    public type Frequency = {
        #TenMinutes;
        #Daily;
        #Weekly;
        #Monthly;
    };

    public type PositionId = Nat;

    // Define the helpfull types for the timer actions
    public type TimerActionType = {
        #StartTimer;
        #StopTimer;
    };

};