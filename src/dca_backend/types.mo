import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Blob "mo:base/Blob";
module {

    // Define the structure of a position
    public type Position = {
        beneficiary : Principal;
        amountToSell : Nat;
        tokenToBuy : Principal;
        tokenToSell : Principal;
        frequency : Frequency;
    };

    public type Frequency = {
        #Daily;
        #Weekly;
        #Mothly;
    };

    public type PositionId = Nat;

    public type Result = {
        #ok : Nat;
        #err : Error;
    };

};
