import sys
import json
from letta import get_response
from bs4 import BeautifulSoup

# Usage: python generate_lesson.py "Lesson Name" "Prompt for Letta"
def main():
    if len(sys.argv) < 3:
        print("Usage: python generate_lesson.py 'Lesson Name' 'Prompt for Letta'")
        sys.exit(1)
    
    lesson_name = sys.argv[1]
    prompt = sys.argv[2]

    # Get HTML from Letta
    html = get_response(prompt)
    if not html:
        print("No response from Letta.")
        sys.exit(1)

    # Parse HTML to plain text
    soup = BeautifulSoup(html, 'html.parser')
    lesson_text = soup.get_text(separator=' ', strip=True)

    # Save as lesson.json
    lesson_data = {
        "name": lesson_name,
        "lesson": lesson_text
    }
    with open("lesson.json", "w", encoding="utf-8") as f:
        json.dump(lesson_data, f, ensure_ascii=False, indent=2)
    print("lesson.json generated.")

if __name__ == "__main__":
    main()
