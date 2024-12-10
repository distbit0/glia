import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { gliaAbi } from '../contracts/gliaAbi';

export function QuestionForm() {
    const [questionText, setQuestionText] = useState('');
    const [answerPeriod, setAnswerPeriod] = useState('3600'); // Default 1 hour in seconds

    const { writeContract, isError, isSuccess } = useWriteContract();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("write contract!!");
        writeContract({
            abi: gliaAbi,
            address: '0xfcabf2d209cf709fa50ecd0693a8eae6f9926969',
            functionName: 'submitQuestion',
            args: [questionText, BigInt(answerPeriod)],
        });
    };

    return (
        <div className="container">
            <h2 className="text-2xl font-bold mb-4">Submit a Question</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Question Text
                    </label>
                    <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="w-full"
                        rows={3}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Answer Period (seconds)
                    </label>
                    <input
                        type="number"
                        value={answerPeriod}
                        onChange={(e) => setAnswerPeriod(e.target.value)}
                        className="w-full"
                        min="1"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4"
                >
                    Submit Question
                </button>
                {isSuccess && (
                    <p className="font-medium">Question submitted successfully!</p>
                )}
                {isError && (
                    <p className="font-medium">Error submitting question</p>
                )}
            </form>
        </div>
    );
}
