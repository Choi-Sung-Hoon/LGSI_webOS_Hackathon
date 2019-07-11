#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#define bluetooth Serial2

static const int RXPin = 50, TXPin = 51;

TinyGPSPlus gps;
SoftwareSerial ss(RXPin, TXPin);

void setup() {
  Serial.begin(9600);
  ss.begin(9600);
  bluetooth.begin(9600);
}

void loop() {
  while (ss.available() > 0) {
    if (gps.encode(ss.read())) {
      displayInfo();
    }
  }
}

void displayInfo()
{
  bluetooth.print(gps.location.lat(), 6);
  bluetooth.print(F(", "));
  bluetooth.println(gps.location.lng(), 6);
}
