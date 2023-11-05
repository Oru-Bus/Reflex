#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define RED 0xF800
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 32

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

const int buttonPin = 33;
const int ledPin = 13;
const unsigned long minButtonPressDuration = 1000;

int nbrLEDOff = 0;
int lastButtonState = 0;
bool started = false;
unsigned long buttonPressStartTime = 0;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  display.clearDisplay();
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();

    if (input == "start") {
      nbrLEDOff = 0;
      display.clearDisplay();
      display.setTextSize(2);
      display.setTextColor(WHITE);
      display.setCursor(0, 10);
      display.println("3");
      display.display();
      delay(1000);
      display.clearDisplay();
      display.setCursor(0, 10);
      display.println("2");
      display.display();
      delay(1000);
      display.clearDisplay();
      display.setCursor(0, 10);
      display.println("1");
      display.display();
      delay(1000);
      display.clearDisplay();
      display.setCursor(0, 10);
      display.println(nbrLEDOff);
      display.display();
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
          nbrLEDOff = nbrLEDOff + 1;
          display.clearDisplay();
          display.setCursor(0, 10);
          display.println(nbrLEDOff);
          display.display();
          Serial.write("LED_OFF\n");
        }
      }
    }
  }
}