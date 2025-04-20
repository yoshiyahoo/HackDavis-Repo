from flask import Flask, request
from flask_cors import CORS
import requests
import uuid
import json
from google import genai
import os
from dotenv import load_dotenv
import markdown
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Load environment variables
load_dotenv()
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

# Gotta use the db connection
db_uri = os.getenv("MONGO_URI")
db_client = MongoClient(db_uri, server_api=ServerApi("1"))

db = db_client["HackDavisData"]

lessons_collection = db["lessons"]

# Get the Mac Address from the device
unique_id = hex(uuid.getnode())

# Get the google genai client
ai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# Setup the routes
app = Flask(__name__)

# Make sure to enable CORS
cors = CORS(app)

# Store the gemini query temporarily
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
        responce2 = ai_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Explain {gemini_query} in some depth"
        )
        html = markdown.markdown(responce2.text)
        return {
            "responce": html
        }


@app.route("/test_db_connection")
def test_db_connection():
    try:
        db_client.admin.command("ping")
    except Exception as e:
        print(f"Error Here: {e}")
        return "failure"
    return "successful"


@app.route("/lessons", methods=["GET", "POST"])
def lessons():
    if request.method == "POST":
        # Lesson will come in as a string
        lesson = request.get_data(as_text=True)
        lessons_collection.insert_one({
            "user
        })
        return ""
    if request.method == "GET":
        lessons = lessons_collection.find({"userID": unique_id})
        return lessons

