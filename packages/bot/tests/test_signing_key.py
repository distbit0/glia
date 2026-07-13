from pathlib import Path
import sys
import unittest

from web3 import Web3


BOT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BOT_ROOT / "src"))

from secret_service import load_signing_key


class SigningKeyTest(unittest.TestCase):
    def test_live_glia_signing_key_can_construct_an_account(self) -> None:
        account = Web3().eth.account.from_key(load_signing_key("glia-bot"))
        self.assertTrue(Web3.is_checksum_address(account.address))


if __name__ == "__main__":
    unittest.main()
