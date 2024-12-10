// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Glia} from "../src/Glia.sol";

contract GliaTest is Test {
    Glia public cm;
    address public alice;
    address public bob;

    function setUp() public {
        cm = new Glia();
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);
    }

    function test_SubmitQuestion() public {
        vm.startPrank(alice);
        uint256 questionId = cm.submitQuestion("What is Ethereum?", 1 days);

        (string memory questionText, , , , ) = cm.getQuestion(questionId);
        assertEq(questionText, "What is Ethereum?");
        vm.stopPrank();
    }

    function test_SubmitAnswer() public {
        vm.startPrank(alice);
        uint256 questionId = cm.submitQuestion("What is Ethereum?", 1 days);
        vm.stopPrank();

        vm.startPrank(bob);
        cm.submitAnswer(questionId, "Ethereum is a blockchain platform");

        (string memory answerText, , , ) = cm.getAnswer(questionId, 0);
        assertEq(answerText, "Ethereum is a blockchain platform");
        vm.stopPrank();
    }

    function test_ScoreAnswer() public {
        vm.startPrank(alice);
        uint256 questionId = cm.submitQuestion("What is Ethereum?", 1 days);
        vm.stopPrank();

        vm.startPrank(bob);
        cm.submitAnswer(questionId, "Ethereum is a blockchain platform");
        vm.stopPrank();

        // Fast forward past answer period
        vm.warp(block.timestamp + 1 days + 1);

        vm.startPrank(alice);
        cm.scoreAnswer(questionId, 0, 95);

        (, , uint256 score, ) = cm.getAnswer(questionId, 0);
        assertEq(score, 95);
        vm.stopPrank();
    }

    function testFail_AnswerAfterPeriod() public {
        vm.startPrank(alice);
        uint256 questionId = cm.submitQuestion("What is Ethereum?", 1 days);
        vm.stopPrank();

        // Fast forward past answer period
        vm.warp(block.timestamp + 1 days + 1);

        vm.startPrank(bob);
        cm.submitAnswer(questionId, "Too late answer");
        vm.stopPrank();
    }

    function testFail_UnauthorizedScoring() public {
        vm.startPrank(alice);
        uint256 questionId = cm.submitQuestion("What is Ethereum?", 1 days);
        vm.stopPrank();

        vm.startPrank(bob);
        cm.submitAnswer(questionId, "Ethereum is a blockchain platform");

        // Bob tries to score his own answer
        vm.warp(block.timestamp + 1 days + 1);
        cm.scoreAnswer(questionId, 0, 100);
        vm.stopPrank();
    }
}
