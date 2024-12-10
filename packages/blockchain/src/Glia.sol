// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Glia {
    struct Question {
        string questionText;
        address submitter;
        uint256 submitTime;
        uint256 answerPeriod;
        bool isScored;
        mapping(uint256 => Answer) answers;
        uint256 answerCount;
    }

    struct Answer {
        string answerText;
        address submitter;
        uint256 score;
        bool isScored;
    }

    mapping(uint256 => Question) public questions;
    uint256 public questionCount;

    event QuestionSubmitted(uint256 indexed questionId, string questionText);
    event AnswerSubmitted(
        uint256 indexed questionId,
        uint256 answerId,
        string answerText
    );
    event AnswerScored(
        uint256 indexed questionId,
        uint256 answerId,
        uint256 score
    );

    function submitQuestion(
        string calldata _questionText,
        uint256 _answerPeriod
    ) external returns (uint256) {
        require(bytes(_questionText).length > 0, "Question cannot be empty");
        require(_answerPeriod > 0, "Answer period must be positive");

        uint256 questionId = questionCount;
        Question storage newQuestion = questions[questionId];

        newQuestion.questionText = _questionText;
        newQuestion.submitter = msg.sender;
        newQuestion.submitTime = block.timestamp;
        newQuestion.answerPeriod = _answerPeriod;
        newQuestion.answerCount = 0;

        questionCount++;

        emit QuestionSubmitted(questionId, _questionText);
        return questionId;
    }

    function submitAnswer(
        uint256 _questionId,
        string calldata _answerText
    ) external {
        require(_questionId < questionCount, "Question does not exist");
        Question storage question = questions[_questionId];

        require(
            block.timestamp < question.submitTime + question.answerPeriod,
            "Answer period has ended"
        );
        require(bytes(_answerText).length > 0, "Answer cannot be empty");

        uint256 answerId = question.answerCount;
        Answer storage newAnswer = question.answers[answerId];

        newAnswer.answerText = _answerText;
        newAnswer.submitter = msg.sender;
        newAnswer.isScored = false;

        question.answerCount++;

        emit AnswerSubmitted(_questionId, answerId, _answerText);
    }

    function scoreAnswer(
        uint256 _questionId,
        uint256 _answerId,
        uint256 _score
    ) external {
        require(_questionId < questionCount, "Question does not exist");
        Question storage question = questions[_questionId];

        require(
            msg.sender == question.submitter,
            "Only question submitter can score"
        );
        require(
            block.timestamp >= question.submitTime + question.answerPeriod,
            "Answer period not ended"
        );
        require(_answerId < question.answerCount, "Answer does not exist");
        require(!question.answers[_answerId].isScored, "Answer already scored");
        require(_score <= 100, "Score must be between 0 and 100");

        Answer storage answer = question.answers[_answerId];
        answer.score = _score;
        answer.isScored = true;

        emit AnswerScored(_questionId, _answerId, _score);
    }

    function getQuestion(
        uint256 _questionId
    )
        external
        view
        returns (
            string memory questionText,
            address submitter,
            uint256 submitTime,
            uint256 answerPeriod,
            uint256 answerCount
        )
    {
        require(_questionId < questionCount, "Question does not exist");
        Question storage question = questions[_questionId];

        return (
            question.questionText,
            question.submitter,
            question.submitTime,
            question.answerPeriod,
            question.answerCount
        );
    }

    function getAnswer(
        uint256 _questionId,
        uint256 _answerId
    )
        external
        view
        returns (
            string memory answerText,
            address submitter,
            uint256 score,
            bool isScored
        )
    {
        require(_questionId < questionCount, "Question does not exist");
        Question storage question = questions[_questionId];
        require(_answerId < question.answerCount, "Answer does not exist");

        Answer storage answer = question.answers[_answerId];
        return (
            answer.answerText,
            answer.submitter,
            answer.score,
            answer.isScored
        );
    }
}
