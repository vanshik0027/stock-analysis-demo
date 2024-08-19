import smtplib

def test_smtp_connection():
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login('vanshik0027@gmail.com', 'jdykhxpchnqzwzyw')
        print("SMTP connection successful")
        server.quit()
    except Exception as e:
        print(f"SMTP connection failed: {e}")

test_smtp_connection()
