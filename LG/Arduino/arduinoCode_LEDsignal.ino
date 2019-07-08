// red led for each breadboard
int red1 = 13;
int red2 = 12;
int red3 = 11;
int red4 = 10;

// yellow led for each breadboard
int yellow1 = 7;
int yellow2 = 6;
int yellow3 = 3;
int yellow4 = 4;

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
  turnOnRed(red_from);
  turnOnRed(red_to);
  int yellow_from = (3 - red_from) % 4;
  int yellow_to = (3 - red_to) % 4
  turnOnYellow(yellow_from);
  turnOnYellow(yellow_to);
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
}

void loop() {
  // put your main code here, to run repeatedly

  
  
}
