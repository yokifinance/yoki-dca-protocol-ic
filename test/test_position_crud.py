from pocket_ic import PocketIC
import pytest
import ic
from ic.candid import Types


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

    icp_ledger_id = ic.Principal.from_str("ryjl3-tyaaa-aaaaa-aaaba-cai")
    ckbtc_ledger_id = ic.Principal.from_str("mxzaz-hqaaa-aaaar-qaada-cai")

    dca_backend_admin = ic.Principal.from_str("hfugy-ahqdz-5sbki-vky4l-xceci-3se5z-2cb7k-jxjuq-qidax-gd53f-nqe")
    user_a = ic.Principal(b"USER_A_PRINCIPAL")
    user_b = ic.Principal(b"USER_B_PRINCIPAL")

    # public type Position from src/dca_backend/types.mo
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
        "beneficiary": user_a.to_str(),
        "amountToSell": 1,
        "tokenToBuy": icp_ledger_id.to_str(),
        "tokenToSell": ckbtc_ledger_id.to_str(),
        "frequency": {"Daily": None},
    }
    position_vals_raw = {
        "beneficiary": user_a,
        "amountToSell": 1,
        "tokenToBuy": icp_ledger_id,
        "tokenToSell": ckbtc_ledger_id,
        "frequency": {"Daily": None},
    }
    return {
        "position_type": position_type,
        "position_vals": position_vals,
        "position_vals_raw": position_vals_raw,
        "user_a": user_a,
        "user_b": user_b,
        "dca_backend_admin": dca_backend_admin,
    }


def test_open_position_positive(data: dict, pocket_ic_instance: dict):

    pic = pocket_ic_instance["pic"]
    canister_id = pocket_ic_instance["canister_id"]
    position_type = data["position_type"]
    position_vals = data["position_vals"]

    position_vals['beneficiary'] = data['user_a'].to_str()
    payload = [{"type": position_type, "value": position_vals}]

    pic.set_sender(data['user_a'])
    result = pic.update_call(canister_id, "openPosition", ic.encode(params=payload))
    assert ic.decode(result)[0]['value'] == 0


def test_get_position_positive(data, pocket_ic_instance):

    pic = pocket_ic_instance["pic"]
    canister_id = pocket_ic_instance["canister_id"]
    position_type = data["position_type"]
    position_vals = data["position_vals"]

    # Creating new Position
    create_position_payload = [{"type": position_type, "value": position_vals}]
    pic.set_sender(data['user_a'])
    open_position_result = pic.update_call(canister_id, "openPosition", ic.encode(params=create_position_payload))
    position_index: int = ic.decode(open_position_result)[0]['value']

    # Build getPosition call payload
    get_position_payload = [
        {"type": Types.Principal, "value": data['user_a'].to_str()},
        {"type": Types.Nat, "value": position_index},
    ]

    # Build expected result type for getPosition method 'async Result<Position, Text>'
    get_position_method_result_type = Types.Variant({"ok": position_type, "err": Types.Text})
    result = pic.query_call(canister_id, "getPosition", ic.encode(params=get_position_payload))
    unpacked_result = ic.decode(result, retTypes=get_position_method_result_type)[0]['value']['ok']

    assert unpacked_result['beneficiary'].to_str() == position_vals['beneficiary'], "beneficiary mismatch"
    assert unpacked_result['amountToSell'] == position_vals['amountToSell'], "amountToSell mismatch"
    assert unpacked_result['tokenToBuy'].to_str() == position_vals['tokenToBuy'], "tokenToBuy mismatch"
    assert unpacked_result['tokenToSell'].to_str() == position_vals['tokenToSell'], "tokenToSell mismatch"

    # Check frequency Variant
    if 'Daily' in unpacked_result['frequency']:
        assert 'Daily' in position_vals['frequency'], "Frequency is not Daily"
    elif 'Weekly' in unpacked_result['frequency']:
        assert 'Weekly' in position_vals['frequency'], "Frequency is not Weekly"
    elif 'Monthly' in unpacked_result['frequency']:
        assert 'Monthly' in position_vals['frequency'], "Frequency is not Monthly"
    else:
        raise ValueError("Unknown frequency")


def test_get_position_negative_wrong_index(data, pocket_ic_instance):

    pic = pocket_ic_instance["pic"]
    canister_id = pocket_ic_instance["canister_id"]
    position_type = data["position_type"]
    position_vals = data["position_vals"]

    # Creating new Position
    create_position_payload = [{"type": position_type, "value": position_vals}]
    pic.set_sender(data['user_a'])
    pic.update_call(canister_id, "openPosition", ic.encode(params=create_position_payload))

    # Build getPosition call payload
    wrong_index = 1
    get_position_payload = [
        {"type": Types.Principal, "value": data['user_a'].to_str()},
        {"type": Types.Nat, "value": wrong_index},
    ]

    # Build expected result type for getPosition method 'async Result<Position, Text>'
    get_position_method_result_type = Types.Variant({"ok": position_type, "err": Types.Text})
    result = pic.query_call(canister_id, "getPosition", ic.encode(params=get_position_payload))
    unpacked_result = ic.decode(result, retTypes=get_position_method_result_type)[0]['value']['err']
    assert unpacked_result == 'Position does not exist for this index'


def test_get_position_negative_wrong_principal(data, pocket_ic_instance):

    pic = pocket_ic_instance["pic"]
    canister_id = pocket_ic_instance["canister_id"]
    position_type = data["position_type"]
    position_vals = data["position_vals"]

    # Creating new Position
    create_position_payload = [{"type": position_type, "value": position_vals}]
    pic.set_sender(data['user_a'])
    open_position_result = pic.update_call(canister_id, "openPosition", ic.encode(params=create_position_payload))
    position_index: int = ic.decode(open_position_result)[0]['value']

    # Build getPosition call payload
    get_position_payload = [
        {"type": Types.Principal, "value": data['user_b'].to_str()},
        {"type": Types.Nat, "value": position_index},
    ]

    # Build expected result type for getPosition method 'async Result<Position, Text>'
    get_position_method_result_type = Types.Variant({"ok": position_type, "err": Types.Text})
    result = pic.query_call(canister_id, "getPosition", ic.encode(params=get_position_payload))
    unpacked_result = ic.decode(result, retTypes=get_position_method_result_type)[0]['value']['err']
    assert unpacked_result == 'Positions do not exist for this user'


def test_get_all_positions_positive(data, pocket_ic_instance):

    pic = pocket_ic_instance["pic"]
    canister_id = pocket_ic_instance["canister_id"]
    position_type = data["position_type"]
    position_vals = data["position_vals"]

    # Creating new Position
    create_position_payload = [{"type": position_type, "value": position_vals}]
    pic.set_sender(data['user_a'])
    pic.update_call(canister_id, "openPosition", ic.encode(params=create_position_payload))

    # Build getAllPositions call payload
    get_all_position_payload = [
        {"type": Types.Principal, "value": data['user_a'].to_str()},
    ]

    # Build expected result type for getAllPositions method 'Result<[Position], Text>'
    get_all_position_method_result_type = Types.Variant({"ok": Types.Vec(position_type), "err": Types.Text})
    result = pic.query_call(canister_id, "getAllPositions", ic.encode(params=get_all_position_payload))
    unpacked_result = ic.decode(result, retTypes=get_all_position_method_result_type)[0]['value']['ok']
    position = unpacked_result[0]

    assert len(unpacked_result) == 1
    assert position['beneficiary'].to_str() == position_vals['beneficiary'], "beneficiary mismatch"
    assert position['amountToSell'] == position_vals['amountToSell'], "amountToSell mismatch"
    assert position['tokenToBuy'].to_str() == position_vals['tokenToBuy'], "tokenToBuy mismatch"
    assert position['tokenToSell'].to_str() == position_vals['tokenToSell'], "tokenToSell mismatch"

    # Check frequency Variant
    if 'Daily' in position['frequency']:
        assert 'Daily' in position_vals['frequency'], "Frequency is not Daily"
    elif 'Weekly' in position['frequency']:
        assert 'Weekly' in position_vals['frequency'], "Frequency is not Weekly"
    elif 'Monthly' in position['frequency']:
        assert 'Monthly' in position_vals['frequency'], "Frequency is not Monthly"
    else:
        raise ValueError("Unknown frequency")


def test_get_all_positions_negative_wrong_principal(data, pocket_ic_instance):

    pic = pocket_ic_instance["pic"]
    canister_id = pocket_ic_instance["canister_id"]
    position_type = data["position_type"]
    position_vals = data["position_vals"]

    # Creating new Position
    create_position_payload = [{"type": position_type, "value": position_vals}]
    pic.set_sender(data['user_a'])
    pic.update_call(canister_id, "openPosition", ic.encode(params=create_position_payload))

    # Build getAllPositions call payload
    get_all_position_payload = [
        {"type": Types.Principal, "value": data['user_b'].to_str()},
    ]

    # Build expected result type for getAllPositions method 'Result<[Position], Text>'
    get_all_position_method_result_type = Types.Variant({"ok": Types.Vec(position_type), "err": Types.Text})
    result = pic.query_call(canister_id, "getAllPositions", ic.encode(params=get_all_position_payload))
    unpacked_result = ic.decode(result, retTypes=get_all_position_method_result_type)[0]['value']['err']
    assert unpacked_result == 'Positions do not exist for this user'


def test_close_position_positive(data, pocket_ic_instance):

    pic = pocket_ic_instance["pic"]
    canister_id = pocket_ic_instance["canister_id"]
    position_type = data["position_type"]
    position_vals = data["position_vals"]

    # Creating new Position
    create_position_payload = [{"type": position_type, "value": position_vals}]
    pic.set_sender(data['user_a'])
    open_position_result = pic.update_call(canister_id, "openPosition", ic.encode(params=create_position_payload))
    position_index: int = ic.decode(open_position_result)[0]['value']

    # Build clonePosition call payload
    close_position_payload = [
        {"type": Types.Principal, "value": data['user_a'].to_str(), "type": Types.Nat, "value": position_index},
    ]

    # Build expected result type for getAllPositions method 'Result<[Position], Text>'
    close_position_payload_method_result_type = Types.Variant({"ok": Types.Text, "err": Types.Text})
    result = pic.update_call(canister_id, "closePosition", ic.encode(params=close_position_payload))
    unpacked_result = ic.decode(result, retTypes=close_position_payload_method_result_type)[0]['value']['ok']
    assert unpacked_result == 'Position deleted'
