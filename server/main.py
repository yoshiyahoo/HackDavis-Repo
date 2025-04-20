from flask import Flask, request
from flask_cors import CORS
import requests
import uuid
from google import genai
import os
from dotenv import load_dotenv
import markdown

# Load environment variables
load_dotenv()

# Get the perplexity URL
url = "https://api.perplexity.ai/chat/completions"


# This is the format in JSON to send to the website that
# This was perplexity
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

responce = requests.post(url, json=payload, headers=headers)


# Get the Mac Address from the device
unique_id = hex(uuid.getnode())

# Get the google genai client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Setup the routes
app = Flask(__name__)

# Make sure to enable CORS
cors = CORS(app)


@app.route("/")
def main():
    return "hello world"


gemini_query = ""


@app.route("/generate_lesson", methods=["GET", "POST"])
def build_lesson():
    global gemini_query
    if request.method == "POST":
        gemini_query = request.get_data(as_text=True)
        print(gemini_query)
        return {
            "responce": ""
        }
    if request.method == "GET":
        responce2 = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Explain how {gemini_query} works"
        )
        html = markdown.markdown(responce2.text)
        return {
            "responce": html
        }


@app.route("/<name>")
def give_name(name):
    return f"Hi {name}"
