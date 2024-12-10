import { useEffect, useState } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { gliaAbi } from '../contracts/gliaAbi.ts';
import { AnswerForm } from './AnswerForm';
import { readContract } from '@wagmi/core';  // Add this import
import { config } from "../../wagmi.config.ts";
import { getAccount } from '@wagmi/core'

interface Question {
    id: number;
    questionText: string;
    submitter: `0x${string}`; // Changed from string to `0x${string}`
    submitTime: bigint;
    answerPeriod: bigint;
    answerCount: bigint;
}

interface Answer {
    answerText: string;
    submitter: `0x${string}`; // Changed from string to `0x${string}`
    score: bigint;
    isScored: boolean;
}

export function QuestionList() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: Answer[] }>({});
    const { data: questionCount } = useReadContract({
        abi: gliaAbi,
        address: '0xfcabf2d209cf709fa50ecd0693a8eae6f9926969', // Replace with actual address
        functionName: 'questionCount',
    });

    const { writeContract } = useWriteContract();

    const fetchQuestion = async (id: number) => {
        const result = await readContract(config, {  // Changed from useReadContract to readContract
            abi: gliaAbi,
            address: '0xfcabf2d209cf709fa50ecd0693a8eae6f9926969',
            functionName: 'getQuestion',
            args: [BigInt(id)],
        });

        if (result) {
            const [questionText, submitter, submitTime, answerPeriod, answerCount] = result;
            return {
                id,
                questionText,
                submitter,
                submitTime,
                answerPeriod,
                answerCount,
            };
        }
    };

    const fetchAnswers = async (questionId: number, answerCount: bigint) => {
        const answers: Answer[] = [];
        for (let i = 0; i < Number(answerCount); i++) {
            const result = await readContract(config, {
                abi: gliaAbi,
                address: '0xfcabf2d209cf709fa50ecd0693a8eae6f9926969', // Replace with actual address
                functionName: 'getAnswer',
                args: [BigInt(questionId), BigInt(i)],
            });
            if (result) {
                answers.push({
                    answerText: result[0],
                    submitter: result[1],
                    score: result[2],
                    isScored: result[3],
                });
            }
        }
        return answers;
    };

    const handleScore = (questionId: number, answerId: number, score: number) => {
        console.log("handling score");
        console.log("questionId: " + questionId, "answerId: " + answerId, "score: " + score);
        writeContract({
            abi: gliaAbi,
            address: '0xfcabf2d209cf709fa50ecd0693a8eae6f9926969', // Replace with actual address
            functionName: 'scoreAnswer',
            args: [BigInt(questionId), BigInt(answerId), BigInt(score)],
        });
    };

    useEffect(() => {
        const loadQuestions = async () => {
            if (questionCount) {
                const questionPromises = [];
                for (let i = 0; i < Number(questionCount); i++) {
                    questionPromises.push(fetchQuestion(i));
                }
                const loadedQuestions = await Promise.all(questionPromises);
                setQuestions(loadedQuestions.filter((q): q is Question => q !== undefined));

                // Fetch answers for each question
                const answersMap: { [key: number]: Answer[] } = {};
                for (const question of loadedQuestions) {
                    if (question) {
                        answersMap[question.id] = await fetchAnswers(question.id, question.answerCount);
                    }
                }
                setAnswers(answersMap);
            }
        };

        loadQuestions();
    }, [questionCount]);

    return (
        <div className="space-y-8">
            {questions.map((question) => (
                <div key={question.id} className="p-6 border border-black">
                    <h2 className="text-xl font-bold mb-2">{question.questionText}</h2>
                    <p className="text-sm">
                        Submitted by: {question.submitter}
                    </p>
                    <p className="text-sm">
                        Answer Period: {Number(question.answerPeriod)} seconds
                    </p>

                    <div className="mt-4">
                        <h3 className="font-semibold">Answers:</h3>
                        {answers[question.id]?.map((answer, index) => (
                            <div key={index} className="answer-card">
                                <p>{answer.answerText}</p>
                                <p className="text-sm text-gray-600">
                                    By: {answer.submitter}
                                </p>
                                {answer.isScored ? (
                                    <p>Score: {Number(answer.score)}</p>
                                ) : (
                                    question.submitter === getAccount(config).address &&
                                    Date.now() / 1000 > Number(question.submitTime) + Number(question.answerPeriod) && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="w-20"
                                                    placeholder="Score"
                                                    id={`score-${question.id}-${index}`}
                                                />
                                                <button
                                                    onClick={() => {
                                                        const input = document.getElementById(`score-${question.id}-${index}`) as HTMLInputElement;
                                                        const score = Number(input.value);
                                                        console.log(score);
                                                        if (score >= 0 && score <= 100) {
                                                            handleScore(question.id, index, score);
                                                        }
                                                    }}
                                                    className="text-sm"
                                                >
                                                    Submit Score
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>

                    <AnswerForm questionId={question.id} />
                </div>
            ))}
        </div>
    );
}
