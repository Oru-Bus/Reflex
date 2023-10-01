#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Livebox-0D40";
const char* password = "lachambre23121999";
const char* mqtt_server = "192.168.1.29";
const char* mqtt_topic = "esp32/command";

WiFiClient espClient;
PubSubClient client(espClient);

const int buttonPin = 33;
const int ledPin = 13;

int lastButtonState = 0;
bool started = false;
unsigned long buttonPressStartTime = 0;
const unsigned long minButtonPressDuration = 100;


void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(2500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.print("Connected to WiFi. IP address: ");
  Serial.println(WiFi.localIP());
}


void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on topic: ");
  Serial.println(topic);
  String command = "";
  for (int i = 0; i < length; i++) {
    command += (char)payload[i];
  }

  if (strcmp(topic, mqtt_topic) == 0) {
    if (command == "start") {
      // Code pour démarrer l'ESP32
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
    } else if (command == "stop") {
      // Code pour arrêter l'ESP32
      digitalWrite(ledPin, LOW);
      // Autres actions à effectuer à l'arrêt
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("Connected to MQTT broker");
      client.subscribe(mqtt_topic);
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}