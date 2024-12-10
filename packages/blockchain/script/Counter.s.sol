// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Glia} from "../src/Glia.sol";

contract GliaScript is Script {
    Glia public cm;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        cm = new Glia();

        vm.stopBroadcast();
    }
}
