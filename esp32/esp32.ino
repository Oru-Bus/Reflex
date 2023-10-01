#include <WiFi.h>

const char* ssid = "Livebox-0D40";
const char* password = "lachambre23121999";

const int buttonPin = 33;
const int ledPin = 13;

int lastButtonState = 0;
bool started = false;
unsigned long buttonPressStartTime = 0;
const unsigned long minButtonPressDuration = 1000;

WiFiServer server(80);

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(2500);
    Serial.println("Connecting to WiFi...");
  }

  Serial.print("Connected to WiFi. IP address: ");
  Serial.println(WiFi.localIP());

  server.begin();
}

void loop() {
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

  WiFiClient client = server.available();
  if (client) {
    while (client.connected()) {
      if (client.available()) {
        String request = client.readStringUntil('\r');
        if (request.indexOf("start") != -1) {
          started = true;
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: text/plain");
          client.println();
          client.println("Started");
          break;
        } else if(request.indexOf("stop") != -1) {
          started = false;
          digitalWrite(ledPin, LOW);
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: text/plain");
          client.println();
          client.println("Stopped");
          break;
        }
      }
    }
    client.stop();
  }
}