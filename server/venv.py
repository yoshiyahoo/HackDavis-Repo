import os

venv_path = os.getenv('VIRTUAL_ENV')

if venv_path:
    print("You are currently in a Python virtual environment.")
    print(f"Virtual environment path: {venv_path}")
else:
    print("You are NOT in a Python virtual environment.")
