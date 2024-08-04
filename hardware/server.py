import cv2
import requests
import json
import time
import os

# Constants
SERVER_URL = "https://pink-garlics-fail.loca.lt"
USERNAME = "hackthe6ix2024"
AUTH0_ID = "google-oauth2|103064479538676048453"
VIDEO_PATH = "video.mp4"  # Change this to your video path
FRAME_INTERVAL = 5  # Time in seconds between frames to capture
NUM_FRAMES = 3  # Number of frames to capture from the video
MAX_RETRIES = 5  # Increased number of retries for transient errors
RETRY_DELAY = 2  # Initial delay in seconds between retries

def get_location():
    # Simulate location data (you may want to use a real GPS module)
    return {"latitude": 37.7749, "longitude": -122.4194}

def capture_frames(video_path, num_frames, interval):
    cap = cv2.VideoCapture(video_path)
    frames = []
    success, frame = cap.read()
    count = 0
    while success and len(frames) < num_frames:
        if count % int(interval * cap.get(cv2.CAP_PROP_FPS)) == 0:
            frames.append(frame)
        success, frame = cap.read()
        count += 1
    cap.release()
    return frames

def save_frames(frames):
    file_paths = []
    for i, frame in enumerate(frames):
        file_path = f"frame_{i}.jpg"
        cv2.imwrite(file_path, frame)
        file_paths.append(file_path)
    return file_paths

def create_emergency_event(location):
    url = f"{SERVER_URL}/create-emergency-event/{USERNAME}"
    data = {
        "location": location,
        "description": "Emergency event",
        "auth0Id": AUTH0_ID
    }
    attempt = 0
    while attempt < MAX_RETRIES:
        try:
            response = requests.post(url, json=data)
            print(f"Create Emergency Event Response Status Code: {response.status_code}")
            print(f"Create Emergency Event Response Text: {response.text}")
            if response.status_code == 200:
                try:
                    response_data = response.json()
                    return response_data['emergencyId']
                except json.JSONDecodeError as e:
                    print("Error decoding JSON response:", e)
            elif response.status_code == 502:
                print("502 Bad Gateway error. Retrying...")
            else:
                print(f"Unexpected error: {response.status_code}")
                print(f"Response: {response.text}")
                break
        except requests.exceptions.RequestException as e:
            print(f"Request exception: {e}")
        attempt += 1
        time.sleep(RETRY_DELAY * (2 ** attempt))  # Exponential backoff
    raise Exception("Failed to create emergency event after multiple attempts.")

def add_emergency_images(emergency_id, file_paths):
    url = f"{SERVER_URL}/add-emergency-image/{USERNAME}/{emergency_id}"
    files = [('images', (os.path.basename(path), open(path, 'rb'), 'image/jpeg')) for path in file_paths]
    attempt = 0
    while attempt < MAX_RETRIES:
        try:
            response = requests.post(url, files=files)
            print(f"Add Emergency Images Response Status Code: {response.status_code}")
            print(f"Add Emergency Images Response Text: {response.text}")
            if response.status_code == 200:
                try:
                    response_data = response.json()
                    return response_data['description']
                except json.JSONDecodeError as e:
                    print("Error decoding JSON response:", e)
                    return None
            else:
                print(f"Unexpected error: {response.status_code}")
                print(f"Response: {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"Request exception: {e}")
        attempt += 1
        time.sleep(RETRY_DELAY * (2 ** attempt))  # Exponential backoff
    return None

def cleanup_files(file_paths):
    for path in file_paths:
        try:
            os.remove(path)
        except OSError as e:
            print(f"Error deleting file {path}: {e}")

def main():
    location = get_location()
    try:
        emergency_id = create_emergency_event(location)
    except Exception as e:
        print(f"Failed to create emergency event: {e}")
        return

    frames = capture_frames(VIDEO_PATH, NUM_FRAMES, FRAME_INTERVAL)
    file_paths = save_frames(frames)

    description = add_emergency_images(emergency_id, file_paths)
    if description:
        print("Emergency description:", description)
    else:
        print("Failed to get a valid description from the server.")

    cleanup_files(file_paths)

if __name__ == "__main__":
    main()
