import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { gliaAbi } from '../contracts/gliaAbi';

interface AnswerFormProps {
    questionId: number;
}

export function AnswerForm({ questionId }: AnswerFormProps) {
    const [answerText, setAnswerText] = useState('');
    const { writeContract, isError, isSuccess } = useWriteContract();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        writeContract({
            abi: gliaAbi,
            address: '0xfcabf2d209cf709fa50ecd0693a8eae6f9926969', // Replace with actual address
            functionName: 'submitAnswer',
            args: [BigInt(questionId), answerText],
        });
    };

    return (
        <div className="container">
            <h3 className="text-lg font-semibold mb-2">Submit Answer</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="w-full"
                        rows={3}
                        placeholder="Your answer..."
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4"
                >
                    Submit Answer
                </button>
                {isSuccess && (
                    <p className="font-medium">Answer submitted successfully!</p>
                )}
                {isError && (
                    <p className="font-medium">Error submitting answer</p>
                )}
            </form>
        </div>
    );
}
