from flask import Flask, request
from flask_cors import CORS
import requests
import uuid
from google import genai
import os
from dotenv import load_dotenv
import markdown
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Load environment variables
load_dotenv()

# Gotta use the db connection
db_uri = os.getenv("MONGO_URI")


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
            contents=f"Explain {gemini_query} in some depth"
        )
        html = markdown.markdown(responce2.text)
        return {
            "responce": html
        }


# Use MONGO DB for this part, but for now this works


@app.route("/get_lessons", methods=["GET", "PUSH"])
def give_name():
    pass
