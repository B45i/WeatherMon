#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <LittleFS.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <DHT11.h>

// Pin Definitions
#define DHTPIN 4
#define BATTERY_PIN A0
#define CONFIG_PIN 5

// Constants
#define DEVICE_ID_LENGTH 21
#define CONFIG_FILE "/config.json"

// Default values
#define DEFAULT_SLEEP_INTERVAL 3600
#define DEFAULT_CALIBRATION 0.606
#define DEFAULT_SERVER_URL "https://example.com/api/logSensorData"

struct Config {
  char deviceId[DEVICE_ID_LENGTH] = "";
  char wifi_ssid[32] = "";
  char wifi_password[64] = "";
  char serverUrl[128] = DEFAULT_SERVER_URL;
  float calibrationFactor = DEFAULT_CALIBRATION;
  uint32_t deepSleepInterval = DEFAULT_SLEEP_INTERVAL;
};

DHT11 dht11(DHTPIN);
AsyncWebServer server(80);
Config config;

// Function declarations
void saveConfig();
bool loadConfig();
void setupAP();
void setupServer();
bool connectWiFi();
void sendDataToServer();
void toggleLED(bool state);

float readBatteryVoltage() {
  int sensorValue = analogRead(BATTERY_PIN);
  float voltage = sensorValue * (3.3 / 1023.0);
  return voltage * 2.0 * config.calibrationFactor;
}

void saveConfig() {
  File file = LittleFS.open(CONFIG_FILE, "w");
  if (!file) {
    Serial.println("Failed to open config file for writing");
    return;
  }
  file.write((uint8_t *)&config, sizeof(Config));
  file.close();
}

bool loadConfig() {
  if (!LittleFS.exists(CONFIG_FILE)) {
    Serial.println("Config file not found");
    return false;
  }
  File file = LittleFS.open(CONFIG_FILE, "r");
  if (!file) {
    Serial.println("Failed to open config file");
    return false;
  }
  size_t read = file.readBytes((char *)&config, sizeof(Config));
  file.close();
  return read == sizeof(Config);
}

void setupAP() {
  WiFi.mode(WIFI_AP);
  WiFi.softAP("ESP8266-Config");
  toggleLED(true);
  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());
}

void setupServer() {
  server.serveStatic("/", LittleFS, "/www/").setDefaultFile("index.html").setCacheControl("max-age=60000");
  server.on("/api/config", HTTP_GET, [](AsyncWebServerRequest *request) {
    String json = "{\"deviceId\":\"" + String(config.deviceId) + "\","
                  "\"wifi_ssid\":\"" + String(config.wifi_ssid) + "\","
                  "\"wifi_password\":\"" + String(config.wifi_password) + "\","
                  "\"serverUrl\":\"" + String(config.serverUrl) + "\","
                  "\"calibrationFactor\":" + String(config.calibrationFactor, 6) + ","
                  "\"deepSleepInterval\":" + String(config.deepSleepInterval) + "}";
    request->send(200, "application/json", json);
  });

  server.on("/api/config", HTTP_POST, [](AsyncWebServerRequest *request) {
    if (request->hasParam("deviceId", true)) {
      strncpy(config.deviceId, request->getParam("deviceId", true)->value().c_str(), DEVICE_ID_LENGTH);
    }
    if (request->hasParam("wifi_ssid", true)) {
      strncpy(config.wifi_ssid, request->getParam("wifi_ssid", true)->value().c_str(), 32);
    }
    if (request->hasParam("wifi_password", true)) {
      strncpy(config.wifi_password, request->getParam("wifi_password", true)->value().c_str(), 64);
    }
    if (request->hasParam("serverUrl", true)) {
      strncpy(config.serverUrl, request->getParam("serverUrl", true)->value().c_str(), 128);
    }
    if (request->hasParam("calibrationFactor", true)) {
      config.calibrationFactor = request->getParam("calibrationFactor", true)->value().toFloat();
    }
    if (request->hasParam("deepSleepInterval", true)) {
      config.deepSleepInterval = request->getParam("deepSleepInterval", true)->value().toInt();
    }
    saveConfig();
    request->send(200, "text/plain", "Configuration updated");
  });

  server.begin();
  toggleLED(true);
}

bool connectWiFi() {
  if (strlen(config.wifi_ssid) == 0) return false;
  WiFi.mode(WIFI_STA);
  WiFi.begin(config.wifi_ssid, config.wifi_password);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  return WiFi.status() == WL_CONNECTED;
}

void sendDataToServer() {
  int temperature = 0;
  int humidity = 0;
  dht11.readTemperatureHumidity(temperature, humidity);
  float battery = readBatteryVoltage();

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  http.begin(client, config.serverUrl);
  http.addHeader("Content-Type", "application/json");

  String jsonData = "{\"deviceId\":\"" + String(config.deviceId) + "\","
                    "\"temperature\":" + String(temperature) + ","
                    "\"humidity\":" + String(humidity) + ","
                    "\"battery\":" + String(battery, 2) + "}";

  int httpCode = http.POST(jsonData);
  if (httpCode > 0) {
    Serial.printf("HTTP Response code: %d\n", httpCode);
  } else {
    Serial.printf("HTTP Request failed: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

void toggleLED(bool state) {
  digitalWrite(LED_BUILTIN, state ? LOW : HIGH);
}

void setup() {
  Serial.begin(115200);
  Serial.println("");
  pinMode(CONFIG_PIN, INPUT_PULLUP);
  pinMode(LED_BUILTIN, OUTPUT);
  toggleLED(false);

  if (!LittleFS.begin()) {
    Serial.println("Failed to mount file system");
    return;
  }

  loadConfig();

  if (digitalRead(CONFIG_PIN) == LOW || strlen(config.deviceId) == 0) {
    Serial.println("Entering configuration mode");
    setupAP();
    setupServer();
    return;
  }

  if (connectWiFi()) {
    sendDataToServer();
    delay(100);
    ESP.deepSleep(config.deepSleepInterval * 1000000ULL);
  } else {
    Serial.println("WiFi connection failed");
    setupAP();
    setupServer();
  }
}

void loop() {
  // Empty as deep sleep is used
}
