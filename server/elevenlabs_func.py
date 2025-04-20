# example.py
import io
import os
import queue
from dotenv import load_dotenv
import numpy as np
from elevenlabs.client import ElevenLabs
from elevenlabs import play
import sounddevice as sd
import threading
import time
from scipy.io.wavfile import write


# Load environment variables from .env file
load_dotenv()

# Get the ElevenLabs API key from the environment variable
elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
client = ElevenLabs(api_key=elevenlabs_api_key)

def play_tts(text):
  audio = client.text_to_speech.convert(
    text=text,
    voice_id="LcfcDJNUP1GQjkzn1xUU",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
  )

  play(audio)



fs = 48000
channels = 2
max_duration = 120  # seconds

q = queue.Queue()
frames = []
stop_event = threading.Event()

def speech_to_text():
  recording_thread = threading.Thread(target=record_stream)
  
  # Start the recording thread
  recording_thread.start() 
  recording_thread.join()
  
  # Save to BytesIO buffer
  np_frames = np.concatenate(frames, axis=0)  # Concatenate all frames
  audio_buffer = io.BytesIO()
  print(type(np_frames))
  write(audio_buffer, fs, np_frames)  # Write WAV format
  audio_buffer.seek(0)  # Rewind to beginning

  text_data = client.speech_to_text.convert(
    file=audio_buffer,  # Use BytesIO buffer
    model_id="scribe_v1", # Model to use, for now only "scribe_v1" is supported
    tag_audio_events=True, # Tag audio events like laughter, applause, etc.
    language_code="eng", # Language of the audio file. If set to None, the model will detect the language automatically.
    diarize=True, # Whether to annotate who is speaking
  )
  return text_data.dict()["text"]

def callback(indata, frames_count, time_info, status):
    q.put(indata.copy())

def record_stream():
  with sd.InputStream(samplerate=fs, channels=channels, callback=callback):
    start_time = time.time()
    while not stop_event.is_set():
      if time.time() - start_time > max_duration:
        break
      try:
        data = q.get(timeout=1)
        frames.append(data)
      except queue.Empty:
        pass