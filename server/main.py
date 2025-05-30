from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import uuid
import json
import os
from dotenv import load_dotenv
import markdown
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from elevenlabs_func import *
from letta import get_response

# Load environment variables
load_dotenv()

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

# Get the table from the database
db = db_client["HackDavisData"]
lessons_collection = db["lessons"]

# Get the Mac Address from the device
unique_id = hex(uuid.getnode())


# Setup the routes
app = Flask(__name__)

# Make sure to enable CORS
cors = CORS(app)

# Store the gemini query temporarily
ai_query = ""
ai_response = ""


@app.route("/generate_lesson", methods=["GET", "POST"])
def build_lesson():
    global ai_query
    global ai_response
    if request.method == "POST":
        ai_query = request.get_data(as_text=True)
        return {
            "response": ""
        }
    if request.method == "GET":
        response2 = get_response(ai_query)
        ai_response = response2
        html = markdown.markdown(ai_response)
        return {
            "response": html
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
    global ai_response
    if request.method == "POST":
        # Lesson will come in as a string
        lesson_title = request.get_data(as_text=True)
        data_to_enter = {
            "userID": unique_id,
            "title": lesson_title.strip(),
            "initial_response": ai_response,
            "completed": False
        }
        if len(lessons_collection.find({"title": lesson_title.strip()}).to_list()) != 0:
            return ""

        lessons_collection.insert_one(data_to_enter)
        return ""  # After the data is entered, the dictionary is modified
    if request.method == "GET":
        lesson_cursor = lessons_collection.find({"userID": unique_id})
        lessons = []
        for lesson in lesson_cursor:
            del lesson["_id"]
            lessons.append(lesson)
        return jsonify(lessons)


@app.get("/get_lesson")
def get_lesson():
    lesson_title = request.get_data(as_text=True)
    if len(lessons_collection.find({"title": lesson_title.strip()}).to_list()) != 0:
        lesson = lessons_collection.find_one({"title": lesson_title.strip()})
        del lesson["_obj"]
        html = markdown.markdown(lesson["initial_response"])
        return {
            "response": html
        }
    else:
        return ""
