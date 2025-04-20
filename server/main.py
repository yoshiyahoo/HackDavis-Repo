from flask import Flask
from flask_cors import CORS
import requests
import uuid
from elevenlabs_func import *

# Get the perplexity URL
url = "https://api.perplexity.ai/chat/completions"


# This is the format in JSON to send to the website that
payload = {
    "model": "sonar-pro",
    "messages": [
        {
            "role": "user",
            "content": "Write me a small story"
        }
    ],
    "max_tokens": 300
}
headers = {
    "Authorization": "Bearer <apiKey>",
    "Content-type": "Application/json",
}

response = requests.post(url, json=payload, headers=headers)


# Get the Mac Address from the device
unique_id = hex(uuid.getnode())



# Setup the routes
app = Flask(__name__)

# Make sure to enable CORS
cors = CORS(app)

if __name__ == "__main__":
    print("hello world")
    print(unique_id)


@app.route("/")
def main():
    return "hello world"


@app.route("/generate_lesson")
def build_lesson():
    return {
        "content": "hey guys"
    }


@app.route("/<name>")
def give_name(name):
    return f"Hi {name}"
