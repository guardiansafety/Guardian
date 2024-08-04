  GNU nano 7.2                                                                                                                                                                                                                                  guardian.py                                                                                                                                                                                                                                           
import RPi.GPIO as GPIO
import time
import subprocess

# Global variable to track the recording process
recording_process = None

def temp_recording():
    global recording_process
    command = [
        'ffmpeg',
        '-f', 'v4l2',
        '-i', '/dev/video0',
        '-an',
        '-vsync', '0',
        '-f', 'null',
        '-'
    ]

    if recording_process is not None:
        print("Recording is already in progress.")
        return

    try:
        recording_process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("Recording started.")
    except Exception as e:
        print(f"An error occurred while starting the recording: {e}")

def stop_recording():
    """Terminate all running ffmpeg processes."""
    try:
        # Execute the pkill command to terminate ffmpeg processes
        subprocess.run("pkill -f 'ffmpeg'", shell=True, check=True)
        print("All ffmpeg processes terminated.")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred while terminating ffmpeg processes: {e}")

def real_recording():
    """Cleanup any existing ffmpeg processes and start recording."""
    pi_command = "ffmpeg -f v4l2 -i /dev/video0 -t 00:00:5 -c:v libx264 -y video.mp4"  # -y flag to overwrite file

    # Cleanup previous ffmpeg processes
    # cleanup_command = "pgrep -f 'ffmpeg' | xargs -r kill -9"

    try:
        # print("Cleaning up any existing ffmpeg processes...")
        # Print the output of the cleanup command for debugging
        # result = subprocess.run(cleanup_command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        # print("Cleanup done. Output:", result.stdout.decode().strip(), "Errors:", result.stderr.decode().strip())

        print("Starting new recording...")
        # Start recording video
        subprocess.run(pi_command, shell=True, check=True)
        print("Recording completed.")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")


# Define the GPIO pins for the rows and columns
ROWS = [16, 20, 21, 5]
COLS = [6, 13, 19, 26]

# Set up the GPIO mode
GPIO.setmode(GPIO.BCM)
for row in ROWS:
    GPIO.setup(row, GPIO.OUT)
    GPIO.output(row, GPIO.HIGH)
for col in COLS:
    GPIO.setup(col, GPIO.IN, pull_up_down=GPIO.PUD_UP)

KEYPAD = [
    ['1', '2', '3', 'A'],
    ['4', '5', '6', 'B'],
    ['7', '8', '9', 'C'],
    ['*', '0', '#', 'D']
]

def scan_keypad():
    for row_index, row in enumerate(ROWS):
        GPIO.output(row, GPIO.LOW)
        for col_index, col in enumerate(COLS):
            if GPIO.input(col) == GPIO.LOW:
                GPIO.output(row, GPIO.HIGH)
                return KEYPAD[row_index][col_index]
        GPIO.output(row, GPIO.HIGH)
    return None

def detect_keypresses():
    keypress_count = 0
    last_keypress_time = time.time()
    first_keypress_time = None
    recording_started = False

    while True:
        key = scan_keypad()
        recording_started = False
        on_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        emergency_keys = ['*', '#', 'A', 'B', 'C', 'D']

        if key in on_keys:
            if recording_started:
                stop_recording()
                recording_started = False
            elif recording_started == False:
                temp_recording()
                recording_started = True
        elif key in emergency_keys:
            stop_recording()
            real_recording()
            return
        time.sleep(0.2)  # Adjust scan delay as needed

def run_external_script1():
    """Run the external Python script."""
    subprocess.run(["python3", "server.py"])

def run_external_script2():
    """Run the external Python script."""
    subprocess.run(["python3", "contact.py"])

if __name__ == '__main__':
    try:
        print('Running...')
        detect_keypresses()  # Start keypress detection
        run_external_script1()
        run_external_script2()
        print('Done.')
    except KeyboardInterrupt:
        stop_recording()  # Ensure recording is stopped on interrupt
        GPIO.cleanup()