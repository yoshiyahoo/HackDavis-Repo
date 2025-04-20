import json
from letta_client import Letta, MessageCreate, TextContent
import os
from dotenv import load_dotenv

load_dotenv()

def get_response(prompt):
    client = Letta(
        token=os.getenv("LETTA_API_KEY"),
    )
    response = client.agents.messages.create(
        agent_id="agent-9bca22dc-a82d-4509-bd8f-f575ec957748",
        messages=[
            MessageCreate(
                role="user",
                content=[
                    TextContent(
                        text=prompt,
                    )
                ],
            )
        ],
    )
    for message in response.messages:
        if message.message_type == "assistant_message":
            return message.dict()["content"]




