#include <SPI.h>
#include <Ethernet.h>
#include <TinyGPS++.h>

byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress server(127, 0, 1, 1);

IPAddress ip(192, 168, 219, 107);
IPAddress myDns(192, 168, 0, 1);
IPAddress gateway(192, 168, 219, 254);
IPAddress subnet(255, 255, 255, 0);

// Initialize the Ethernet server library
// with the IP address and port you want to use
EthernetClient client;

static const uint32_t GPSBaud = 4800;
float latitude = 0;
float longitude = 0;

// The TinyGPS++ object
TinyGPSPlus gps;

 
void setup() {
  Serial.begin(9600);
  Serial1.begin(115200); //Pin 18,19
  Serial.print(F("Testing TinyGPS++ library v. ")); Serial.println(TinyGPSPlus::libraryVersion());

  Ethernet.begin(mac, ip, myDns, gateway, subnet);
 
  if (Ethernet.hardwareStatus() == EthernetNoHardware) {
    Serial.println("Cannot find Ethernet shield.");
    while (true) {
      delay(1); // do nothing
    }
  }
  if (Ethernet.linkStatus() == LinkOFF) {
    Serial.println("Ethernet cable is not connected.");
  }

  // connect to server
  if(client.connect(server, 9999))
    Serial.println("connected!!");
  else
    Serial.println("cannot connect :(");
}
 
void loop() {
  char char_longlat[32] = {0};
  String longlat;
  
  while(Serial1.available() > 0){
    if (gps.encode(Serial1.read()))
      displayInfo();

    longlat = String(latitude) + String(",") + String(longitude);
    longlat.toCharArray(char_longlat, longlat.length());
    client.write(&longlat);
  }
  
  if (millis() > 5000 && gps.charsProcessed() < 10)
  {
    Serial.println(F("No GPS detected: check wiring."));
    while(true);
  }
  
}

void displayInfo()
{
  Serial.print(F("Location: ")); 
  if (gps.location.isValid())
  {
    Serial.print(gps.location.lat(), 6);
    Serial.print(F(","));
    Serial.print(gps.location.lng(), 6);

    latitude = gps.location.lat();
    longitude = gps.location.lng();
  }
  else
  {
    Serial.print(F("INVALID"));
  }

  Serial.print(F("  Date/Time: "));
  if (gps.date.isValid())
  {
    Serial.print(gps.date.month());
    Serial.print(F("/"));
    Serial.print(gps.date.day());
    Serial.print(F("/"));
    Serial.print(gps.date.year());
  }
  else
  {
    Serial.print(F("INVALID"));
  }

  Serial.print(F(" "));
  if (gps.time.isValid())
  {
    if (gps.time.hour() < 10) Serial.print(F("0"));
    Serial.print(gps.time.hour());
    Serial.print(F(":"));
    if (gps.time.minute() < 10) Serial.print(F("0"));
    Serial.print(gps.time.minute());
    Serial.print(F(":"));
    if (gps.time.second() < 10) Serial.print(F("0"));
    Serial.print(gps.time.second());
    Serial.print(F("."));
    if (gps.time.centisecond() < 10) Serial.print(F("0"));
    Serial.print(gps.time.centisecond());
  }
  else
  {
    Serial.print(F("INVALID"));
  }

  Serial.println();
}
