import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv("HF_MODEL", "Qwen/Qwen3-32B")

if not HF_TOKEN:
    raise RuntimeError("HF_TOKEN is missing from .env")

client = InferenceClient(
    api_key=HF_TOKEN
)


def generate_response(system_prompt: str, user_prompt: str) -> str:

    response = client.chat_completion(
        model=HF_MODEL,
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        max_tokens=1000,
        temperature=0.7
    )

    return response.choices[0].message.content
