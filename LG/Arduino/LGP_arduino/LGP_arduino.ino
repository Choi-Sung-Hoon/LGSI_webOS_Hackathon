#include <SoftwareSerial.h>
#include <LiquidCrystal.h>
#include <SoftwareSerial.h>
#include <TinyGPS.h>

SoftwareSerial BTSerial(4,5); // bluetooth

// gps
float lat = 28.5458,lon = 77.1703; // create variable for latitude and longitude object 
SoftwareSerial gpsSerial(3,4);//rx,tx
LiquidCrystal lcd(A0,A1,A2,A3,A4,A5);
TinyGPS gps;

// red led for each breadboard
int red1 = 13;
int red2 = 12;
int red3 = 11;
int red4 = 10;

// yellow led for each breadboard
int yellow1 = 9;
int yellow2 = 7;
int yellow3 = 6;
int yellow4 = 5;

// making red led to blink asynchronously
int red1_blink_time = 200;
int red2_blink_time = 200;
int red3_blink_time = 200;
int red4_blink_time = 200;

long red1_last_blink;
long red2_last_blink;
long red3_last_blink;
long red4_last_blink;

// making yellow led to blink asynchronously
int yellow1_blink_time = 500;
int yellow2_blink_time = 500;
int yellow3_blink_time = 500;
int yellow4_blink_time = 500;

long yellow1_last_blink;
long yellow2_last_blink;
long yellow3_last_blink;
long yellow4_last_blink;

// function for turning on the red light
void turnOnRed(int led) {
  if(led == 0) {
    if((millis() - red1_last_blink) >= red1_blink_time) {
      if(digitalRead(red1) == HIGH) {
        digitalWrite(red1, LOW);
      } else {
        digitalWrite(red1, HIGH);
      }
    }
    red1_last_blink = millis();
  }

  else if(led == 1) {
    if((millis() - red2_last_blink) >= red2_blink_time) {
      if(digitalRead(red2) == HIGH) {
        digitalWrite(red2, LOW);
      } else {
        digitalWrite(red2, HIGH);
      }
    }
    red2_last_blink = millis();
  }

  else if(led == 2) {
    if((millis() - red3_last_blink) >= red3_blink_time) {
      if(digitalRead(red3) == HIGH) {
        digitalWrite(red3, LOW);
      } else {
        digitalWrite(red3, HIGH);
      }
    }
    red3_last_blink = millis();
  }

  else if(led == 3) {
    if((millis() - red4_last_blink) >= red4_blink_time) {
      if(digitalRead(red4) == HIGH) {
        digitalWrite(red4, LOW);
      } else {
        digitalWrite(red4, HIGH);
      }
    }
    red4_last_blink = millis();
  }
}

// function for turning on the yellow light
void turnOnYellow(int led) {
  if(led == 0) {
    if((millis() - yellow1_last_blink) >= yellow1_blink_time) {
      if(digitalRead(yellow1) == HIGH) {
        digitalWrite(yellow1, LOW);
      } else {
        digitalWrite(yellow1, HIGH);
      }
    }
    yellow1_last_blink = millis();
  }

  else if(led == 1) {
    if((millis() - yellow2_last_blink) >= yellow2_blink_time) {
      if(digitalRead(yellow2) == HIGH) {
        digitalWrite(yellow2, LOW);
      } else {
        digitalWrite(yellow2, HIGH);
      }
    }
    yellow2_last_blink = millis();
  }

  else if(led == 2) {
    if((millis() - yellow3_last_blink) >= yellow3_blink_time) {
      if(digitalRead(yellow3) == HIGH) {
        digitalWrite(yellow3, LOW);
      } else {
        digitalWrite(yellow3, HIGH);
      }
    }
    yellow3_last_blink = millis();
  }

  else if(led == 3) {
    if((millis() - yellow4_last_blink) >= yellow4_blink_time) {
      if(digitalRead(yellow4) == HIGH) {
        digitalWrite(yellow4, LOW);
      } else {
        digitalWrite(yellow4, HIGH);
      }
    }
    yellow4_last_blink = millis();
  }
}

// light up the appropriate led on the road to open path for ambulance
void openPath(int red_from, int red_to) {
  int yellow_from = -1, yellow_to = -1;
  for(int i=0;i<4;i++) {
    if(i != red_from) {
      yellow_from = i;
      break;
    }
  }

  for(int i=0;i<4;i++) {
    if(i != red_from && i != red_to && i != yellow_from) {
      yellow_to = i;
      break;
    }
  }

  while(1) {
    turnOnRed(red_from);
    turnOnRed(red_to);
    turnOnYellow(yellow_from);
    turnOnYellow(yellow_to);
  }
}

void setup() {
  // put your setup code here, to run once:
  pinMode(red1, OUTPUT);
  pinMode(red2, OUTPUT);
  pinMode(red3, OUTPUT);
  pinMode(red4, OUTPUT);

  pinMode(yellow1, OUTPUT);
  pinMode(yellow2, OUTPUT);
  pinMode(yellow3, OUTPUT);
  pinMode(yellow4, OUTPUT);

  String setName = String("AT+NAME=YoolaBTBee\r\n");
  Serial.begin(9600);
  gpsSerial.begin(9600);
  lcd.begin(16,2);
  
  BTSerial.print("AT\r\n");
  delay(500);

  while(BTSerial.available()) {
    Serial.write(BTSerial.read());
  }
}

void loop() {
  // put your main code here, to run repeatedly

  while(gpsSerial.available()){ // check for gps data
    if(gps.encode(gpsSerial.read()))// encode gps data
    { 
    gps.f_get_position(&lat,&lon); // get latitude and longitude
    // display position
    lcd.clear();
    lcd.setCursor(1,0);
    lcd.print("GPS Signal");
    //Serial.print("Position: ");
    //Serial.print("Latitude:");
    //Serial.print(lat,6);
    //Serial.print(";");
    //Serial.print("Longitude:");
    //Serial.println(lon,6); 
    lcd.setCursor(1,0);
    lcd.print("LAT:");
    lcd.setCursor(5,0);
    lcd.print(lat);
    //Serial.print(lat);
    //Serial.print(" ");
    
    lcd.setCursor(0,1);
    lcd.print(",LON:");
    lcd.setCursor(5,1);
    lcd.print(lon);
    
   }
  }
  
  String latitude = String(lat,6);
    String longitude = String(lon,6);
  Serial.println(latitude+";"+longitude);
  delay(1000);
  
  openPath(0,3);  
}
