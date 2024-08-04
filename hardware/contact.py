import os
from twilio.rest import Client
from dotenv import load_dotenv

# API Credentials
load_dotenv()
account_sid = os.getenv('ACCOUNT_SID')
auth_token = os.getenv('AUTH_TOKEN')
flask_host = os.getenv('FLASK_URL')
twilio_phone_number = os.getenv('TWILIO_PHONE_NUMBER')
emergency_phone_number = os.getenv('EMERGENCY_PHONE_NUMBER')
emergency_text_number = os.getenv('EMERGENCY_TEXT_NUMBER')
location = os.getenv('LOCATION')
name = os.getenv('NAME')
dashboard_url = os.getenv('DASHBOARD_URL')
client = Client(account_sid, auth_token)

# Message Content
sms_message = f'''
    SOS Alert: {name} has activated his Guardian alert and may be in danger.\n\nEmergency response is on their way.\n\nLast known location: \
    {location}.Visit dashboard for more info: {dashboard_url}\n\n- Guardian ©
'''

voicemail_message = f'''
    SOS: {name} has activated his Guardian alert and may be in danger. Last known location: {location}. Disaptch emergency personnel immediately. Find more information at {dashboard_url}. Sent by Guardian.
'''

twiml = f"<Response><Say voice='Polly.Matthew'>{voicemail_message}</Say></Response>"

# Send SMS
message = client.messages.create(
    body=sms_message,
    from_=twilio_phone_number,  
    to=emergency_text_number
)

# Make phone call
call = client.calls.create(
    twiml=twiml,
    to=emergency_phone_number,
    from_=twilio_phone_number,
)
