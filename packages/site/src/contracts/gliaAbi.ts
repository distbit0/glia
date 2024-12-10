export const gliaAbi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_questionId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_answerId",
                "type": "uint256"
            }
        ],
        "name": "getAnswer",
        "outputs": [
            {
                "internalType": "string",
                "name": "answerText",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "submitter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "score",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isScored",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_questionId",
                "type": "uint256"
            }
        ],
        "name": "getQuestion",
        "outputs": [
            {
                "internalType": "string",
                "name": "questionText",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "submitter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "submitTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "answerPeriod",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "answerCount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "questionCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_questionId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_answerId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_score",
                "type": "uint256"
            }
        ],
        "name": "scoreAnswer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_questionId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_answerText",
                "type": "string"
            }
        ],
        "name": "submitAnswer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_questionText",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_answerPeriod",
                "type": "uint256"
            }
        ],
        "name": "submitQuestion",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;