#include <SoftwareSerial.h>
#include <TinyGPS.h>

#define RXPIN 3
#define TXPIN 4
#define GPSBAUD 9600

SoftwareSerial BTSerial(1,2); // bluetooth
SoftwareSerial uart_gps(RXPIN, TXPIN);


// gps
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

// function for gps


void getgps (TinyGPS gps)
{
  // 모든 데이터를 코드에서 사용할 수있는 varialbes로 가져 오려면, 변수를 정의하고 객체를 핸들링 하면된다.
  // 데이터. 함수의 전체 목록을 보려면에서 keywords.txt 파일을 참조
  // TinyGPS와 NewSoftSerial 라이브러리.
  // 경, 위도 변수를 정의
  float latitude, longitude;
  // 함수 호출
  gps.f_get_position (&latitude, &longitude);
  //경위도 출력 가능
  Serial.print("Lat/Long: ");
  Serial.print(latitude,5);
  Serial.print(", ");
  Serial.println(longitude,5);
  
  // 날짜와 시간은 같음
  int year;
  byte month, day, hour, minute, second, hundredths;
  gps.crack_datetime(&year,&month,&day,&hour,&minute,&second,&hundredths);
  // 데이터 및 시간 출력
  Serial.print("Date: "); Serial.print(month, DEC); Serial.print("/");
  Serial.print(day, DEC); Serial.print("/"); Serial.print(year);
  Serial.print("  Time: "); Serial.print(hour, DEC); Serial.print(":");
  Serial.print(minute, DEC); Serial.print(":"); Serial.print(second, DEC);
  Serial.print("."); Serial.println(hundredths, DEC);

//고도와 코스 값을 직접 출력
  Serial.print("Altitude (meters): "); Serial.println(gps.f_altitude());  Serial.print("Course (degrees): "); Serial.println(gps.f_course());
  Serial.print("Speed(kmph): "); Serial.println(gps.f_speed_kmph());
  Serial.println ();
  
  //통계 값 출력
 unsigned long chars;
  unsigned short sentences, failed_checksum;
  gps.stats(&chars, &sentences, &failed_checksum);
 delay (10000);
}

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

  //bluetooth
  String setName = String("AT+NAME=MyBTBee\r\n");
  
  Serial.begin(9600);

  //gps
  uart_gps.begin(GPSBAUD);
  
  BTSerial.print("AT\r\n");

  while(BTSerial.available()) {
    Serial.write(BTSerial.read());
  }
}

void loop() {
  // put your main code here, to run repeatedly
  
  while (uart_gps.available ()) // RX 핀에 데이터가있는 동안 ...
  {
      int c = uart_gps.read (); // 데이터를 변수에로드 ...
      if (gps.encode (c)) // 새로운 유효한 문장이있는 경우 ...
      {
        getgps (gps); // 데이터를 가져온다.
      }
  }
  
  openPath(0,3);  
}
