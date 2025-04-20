import json
import sys
import os
import re
import subprocess
import html
from letta import get_response

def extract_title_and_content(html_content):
    """Extract title and content from Letta response using regex instead of BeautifulSoup"""
    # Simple HTML tag removal
    text_content = re.sub(r'<[^>]+>', ' ', html_content)
    text_content = html.unescape(text_content)  # Handle HTML entities
    text_content = re.sub(r'\s+', ' ', text_content).strip()  # Normalize whitespace
    
    # Split into lines (by periods for sentences if no clear line breaks)
    lines = [line.strip() for line in re.split(r'(?<=[.!?])\s+', text_content) if line.strip()]
    
    # Extract title
    title = "Untitled Lesson"
    content = text_content
    
    if lines and len(lines) > 0:
        if text_content.startswith("title="):
            # Extract title if it starts with title=
            title_match = re.match(r'title=(.*?)(?:\.|$)', text_content)
            if title_match:
                title = title_match.group(1).strip()
                # Remove title= part from content
                content = text_content[len(f"title={title}"):].strip()
        else:
            # Use first sentence as title
            title = lines[0][:50]
            if len(title) == 50:
                title += "..."
    
    return title, content

def save_lesson_json(title, content):
    """Save lesson data to lesson.json"""
    lesson_data = {
        "name": title,
        "lesson": content
    }
    
    with open("lesson.json", "w", encoding="utf-8") as f:
        json.dump(lesson_data, f, ensure_ascii=False, indent=2)
    
    print(f"Saved lesson '{title}' to lesson.json")
    return lesson_data

def generate_quiz():
    """Run gemini.js to generate quiz from lesson.json"""
    try:
        # Run node gemini.js
        result = subprocess.run(
            ["node", "gemini.js"], 
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            print(f"Error running gemini.js: {result.stderr}")
            return False
        
        print("Quiz generated successfully")
        return True
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        return False

def process_prompt(prompt):
    """Process a prompt through the entire pipeline"""
    try:
        # 1. Get response from Letta
        print("Getting response from Letta...")
        letta_response = get_response(prompt)
        
        if not letta_response:
            print("Error: No response from Letta")
            return False
        
        # 2. Extract title and content
        print("Extracting title and content...")
        title, content = extract_title_and_content(letta_response)
        
        # 3. Save to lesson.json
        print("Saving lesson data...")
        save_lesson_json(title, content)
        
        # 4. Generate quiz using gemini.js
        print("Generating quiz...")
        quiz_success = generate_quiz()
        
        if quiz_success:
            print("Process completed successfully!")
            return True
        else:
            print("Failed to generate quiz")
            return False
            
    except Exception as e:
        print(f"Error processing prompt: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_lesson.py \"Your prompt here\"")
        sys.exit(1)
    
    prompt = sys.argv[1]
    success = process_prompt(prompt)
    sys.exit(0 if success else 1)
