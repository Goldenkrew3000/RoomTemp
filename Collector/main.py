import rp2
import network
from machine import Pin, I2C
from max6675 import MAX6675
import time
import urequests as requests

SSID = ""
PASS = ""
COUNTRY = "AU"
WAITSEC = 600

def WIFI_Connect():
    print("Connecting to WiFi")
    rp2.country(COUNTRY)
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.config(pm = 0xa11140) # Set power saving mode off
    wlan.connect(SSID, PASS)
    while not wlan.isconnected() and wlan.status() >= 0:
        print("Currently connecting...")
        time.sleep(1)
    print("Connected to WiFi network")
    print(wlan.ifconfig()) # DHCP IP, Subnet, Gateway, DNS

def readMAX():
    print("Reading from MAX6675")
    maxData = max.read()
    maxData = str(maxData)
    print("Temperature: " + maxData)
    return maxData

def runTask():
    maxTemp = readMAX()
    url = "http://192.168.5.5:8080/sendToDB?temp=" + maxTemp
    try:
        request = requests.get(url)
        print(request.content)
        request.close()
    except:
        print("Failed")
    print("Ran task")

print("Bedroom Temperature Monitor")

# Configure MAX6675 I2C
so = Pin(15, Pin.IN)
sck = Pin(13, Pin.OUT)
cs = Pin(14, Pin.OUT)
max = MAX6675(sck, cs , so)

WIFI_Connect()

while(True):
    print("Measuring")
    runTask()
    time.sleep(WAITSEC)
