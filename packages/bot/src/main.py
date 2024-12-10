import os
import json
from web3 import Web3
from loguru import logger
from dotenv import load_dotenv
from openai import OpenAI
import time

# Load contract ABI
CONTRACT_ABI = [
    {"inputs":[],"name":"questionCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_questionId","type":"uint256"}],"name":"getQuestion","outputs":[{"internalType":"string","name":"questionText","type":"string"},{"internalType":"address","name":"submitter","type":"address"},{"internalType":"uint256","name":"submitTime","type":"uint256"},{"internalType":"uint256","name":"answerPeriod","type":"uint256"},{"internalType":"uint256","name":"answerCount","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_questionId","type":"uint256"},{"internalType":"string","name":"_answerText","type":"string"}],"name":"submitAnswer","outputs":[],"stateMutability":"nonpayable","type":"function"}
]

class GliaBot:
    def __init__(self):
        load_dotenv()
        
        # Initialize Web3
        self.w3 = Web3(Web3.HTTPProvider(os.getenv('RPC_URL')))
        
        # Set up account
        self.private_key = os.getenv('PRIVATE_KEY')
        self.account = self.w3.eth.account.from_key(self.private_key)
        
        # Initialize contract
        self.contract = self.w3.eth.contract(
            address=self.w3.to_checksum_address(os.getenv('CONTRACT_ADDRESS')),
            abi=CONTRACT_ABI
        )
        
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY"),
        )
        

    def get_ai_answer(self, question):
        """Get answer from GPT-4 for the given question."""
        try:
            completion = self.client.chat.completions.create(
                extra_headers={
                    "HTTP-Referer": "https://glia.bot",  # Replace with your actual site URL
                    "X-Title": "GliaBot",  # Your app name
                },
                model="openai/gpt-4o-2024-05-13",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant. Provide clear, concise answers."},
                    {"role": "user", "content": question}
                ]
            )
            return completion.choices[0].message.content
        except Exception as e:
            logger.error(f"Error getting AI answer: {e}")
            return None

    def submit_answer(self, question_id, answer):
        """Submit an answer to the contract."""
        try:
            transaction = self.contract.functions.submitAnswer(
                question_id,
                answer
            ).build_transaction({
                'from': self.account.address,
                'nonce': self.w3.eth.get_transaction_count(self.account.address),
                'gas': 500000,
                'gasPrice': self.w3.eth.gas_price
            })
            
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.raw_transaction)
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            logger.info(f"Answer submitted for question {question_id}. Transaction hash: {receipt.transactionHash.hex()}")
            return True
        except Exception as e:
            logger.error(f"Error submitting answer: {e}")
            return False

    def check_and_answer_questions(self):
        """Check for unanswered questions and submit answers."""
        try:
            question_count = self.contract.functions.questionCount().call()
            logger.info(f"Total questions: {question_count}")

            for question_id in range(question_count):
                try:
                    question_data = self.contract.functions.getQuestion(question_id).call()
                    question_text = question_data[0]
                    submit_time = question_data[2]
                    answer_period = question_data[3]
                    answer_count = question_data[4]

                    # Check if question is still in answer period
                    current_time = int(time.time())
                    if current_time > submit_time + answer_period:
                        continue

                    # Skip if we've already answered
                    if answer_count > 0:
                        continue

                    # Get AI answer and submit
                    ai_answer = self.get_ai_answer(question_text)
                    if ai_answer:
                        logger.info(f"Processed question {question_id} {question_text} with AI answer {ai_answer}")
                        self.submit_answer(question_id, ai_answer)

                except Exception as e:
                    logger.error(f"Error processing question {question_id}: {e}")
                    continue

        except Exception as e:
            logger.error(f"Error checking questions: {e}")

def main():
    logger.info("Starting Glia Bot")
    bot = GliaBot()
    bot.check_and_answer_questions()
    logger.info("Finished processing questions")

if __name__ == "__main__":
    main()