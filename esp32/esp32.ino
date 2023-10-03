const int buttonPin = 33;
const int ledPin = 13;
const unsigned long minButtonPressDuration = 1000;

int lastButtonState = 0;
bool started = false;
unsigned long buttonPressStartTime = 0;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    
    if (input == "start") {
      started = true;
    } else if (input == "stop") {
      started = false;
      digitalWrite(ledPin, LOW);
    }
  }

  if (started) {
    int buttonState = digitalRead(buttonPin);
    digitalWrite(ledPin, HIGH);

    if (lastButtonState != buttonState) {
      lastButtonState = buttonState;

      if (buttonState == HIGH) {
        buttonPressStartTime = millis();
      } else if (buttonState == LOW) {
        unsigned long buttonPressDuration = millis() - buttonPressStartTime;

        if (buttonPressDuration >= minButtonPressDuration) {
          digitalWrite(ledPin, LOW);
          delay(1500);
        }
      }
    }
  }
}