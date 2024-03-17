from pocket_ic import PocketIC
import pytest
import ic
from ic.candid import Types


# public type Position = {
#     beneficiary : Principal;
#     amountToSell : Nat;
#     tokenToBuy : Principal;
#     tokenToSell : Principal;
#     frequency : Frequency;
# };


@pytest.fixture(name="pocket_ic_instance")
def pocket_ic():
    pic = PocketIC()
    canister_id = pic.create_canister()
    pic.add_cycles(canister_id, 1_000_000_000_000_000_000)
    with open(".dfx/ic/canisters/dca_backend/dca_backend.wasm", "rb") as wasm_file:
        wasm_module = wasm_file.read()
    pic.install_code(canister_id, bytes(wasm_module), [])
    return {"pic": pic, "canister_id": canister_id}


@pytest.fixture(name="data")
def test_data():
    default_principal = ic.Principal.from_str(
        "hfugy-ahqdz-5sbki-vky4l-xceci-3se5z-2cb7k-jxjuq-qidax-gd53f-nqe"
    )
    icp_principal_id = ic.Principal.from_str("ryjl3-tyaaa-aaaaa-aaaba-cai")
    ckBtc_principal_id = ic.Principal.from_str("mxzaz-hqaaa-aaaar-qaada-cai")
    position_type = Types.Record(
        {
            "beneficiary": Types.Principal,
            "amountToSell": Types.Nat,
            "tokenToBuy": Types.Principal,
            "tokenToSell": Types.Principal,
            "frequency": Types.Variant(
                {
                    "Daily": Types.Null,
                    "Weekly": Types.Null,
                    "Monthly": Types.Null,
                }
            ),
        }
    )
    position_vals = {
        "beneficiary": default_principal.to_str(),
        "amountToSell": 1,
        "tokenToBuy": ckBtc_principal_id.to_str(),
        "tokenToSell": icp_principal_id.to_str(),
        "frequency": {"Daily": None},
    }
    return {
        "position_type": position_type,
        "position_vals": position_vals,
        "default_principal": default_principal,
    }


def test_open_position(data, pocket_ic_instance):

    pic = pocket_ic_instance["pic"]
    canister_id = pocket_ic_instance["canister_id"]
    position_type = data["position_type"]
    position_vals = data["position_vals"]
    payload = [{"type": position_type, "value": position_vals}]
    result = pic.update_call(canister_id, "openPosition", ic.encode(params=payload))
    assert ic.decode(result, retTypes=[Types.Nat]) == 0


def test_get_position_negative(data, pocket_ic_instance):

    pic = pocket_ic_instance["pic"]
    canister_id = pocket_ic_instance["canister_id"]
    position_types = data["position_type"]
    position_index = [
        {"type": Types.Principal, "value": data["default_principal"].to_str()},
        {"type": Types.Nat, "value": 0},
    ]
    # result = pic.query_call(canister_id, "getPosition", ic.encode(position_index))
    # assert ic.decode(result) == [
    #     {"type": "rec_2", "value": {"_5048165": "Positions do not exist for this user"}}
    # ]
    result = pic.query_raw(
        canister_id=canister_id,
        name="getPosition",
        arguments=position_index,
        return_types=[Types.Nat],
        _effective_canister_id=None
    )
    assert result == 0
