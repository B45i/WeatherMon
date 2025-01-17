// ESP8266 Node.
#include <ESP8266WiFi.h>
#include <espnow.h>
#include <LittleFS.h>
#include <ESPAsyncTCP.h>        // https://github.com/me-no-dev/ESPAsyncTCP
#include <ESPAsyncWebServer.h>  // https://github.com/me-no-dev/ESPAsyncWebServer?tab=readme-ov-file
#include <DHT11.h>              // https://github.com/dhrubasaha08/DHT11

#define DHTPIN 4

#define BATTERY_PIN A0
#define VOLTAGE_DIVIDER_RATIO 2.0  // 100kΩ & 100kΩ divider halves the voltage
#define ADC_MAX_VALUE 1023
#define REFERENCE_VOLTAGE 3.3  // Reference voltage
#define DEVICE_ID_LENGTH 21
#define DEVICE_ID_FILE "/device_id.conf"
#define MAC_FILE "/hub_mac.conf"


enum PacketType {
  PACKET_TYPE_REQUEST_MAC = 1,
  PACKET_TYPE_SENSOR_DATA = 2
};

struct DataPacket {
  PacketType packetType = PACKET_TYPE_SENSOR_DATA;
  float temperature;
  float humidity;
  float batteryVoltage;
  char deviceId[DEVICE_ID_LENGTH];
};

DHT11 dht11(DHTPIN);
AsyncWebServer server(80);


uint8_t hubMac[6];
bool isMacReceived = false;
char deviceId[DEVICE_ID_LENGTH] = "";
bool isDeviceIdSet = false;
const uint64_t deepSleepIntervalMs = 60ULL * 60 * 1000;  // 1hr in mills



void printMac(const uint8_t *mac) {
  for (int i = 0; i < 6; i++) {
    Serial.printf("%02X", mac[i]);
    if (i < 5) Serial.print(":");
  }
  Serial.println();
}

void saveDeviceIdToFlash(const char *id) {
  File file = LittleFS.open(DEVICE_ID_FILE, "w+");
  if (file) {
    file.write((const uint8_t *)id, strlen(id));
    file.close();
  }
}

void saveMacToFlash(const uint8_t *mac) {
  File file = LittleFS.open(MAC_FILE, "w+");
  if (file) {
    file.write(mac, 6);
    file.close();
  }
}

bool loadMacFromFlash(uint8_t *mac) {
  if (!LittleFS.exists(MAC_FILE)) {
    return false;
  }

  File file = LittleFS.open(MAC_FILE, "r");
  if (!file) {
    return false;
  }

  file.read(mac, 6);
  file.close();
  return true;
}

bool loadDeviceIdFromFlash(char *deviceId) {
  if (!LittleFS.exists(DEVICE_ID_FILE)) {
    return false;
  }

  File file = LittleFS.open(DEVICE_ID_FILE, "r");
  if (!file) {
    return false;
  }

  file.readBytes(deviceId, DEVICE_ID_LENGTH);
  file.close();
  return true;
}

void setupAP() {
  WiFi.softAP("Node-AP");
  Serial.print("Access Point Started: ");
  Serial.println(WiFi.softAPIP());
}

void setupServer() {
  setupAP();
  server.serveStatic("/", LittleFS, "/www/").setDefaultFile("index.html").setCacheControl("max-age=60000");

  server.on("/rest/deviceid", HTTP_GET, [](AsyncWebServerRequest *request) {
    String response = String(deviceId);
    request->send(200, "text/plain", response);
  });

  server.on("/rest/update", HTTP_POST, [](AsyncWebServerRequest *request) {
    if (!request->hasParam("deviceId")) {
      request->send(400, "text/plain", "Missing deviceId parameter");
      return;
    }

    String newDeviceId = request->getParam("deviceId")->value();
    Serial.println(newDeviceId);
    saveDeviceIdToFlash(newDeviceId.c_str());
    isDeviceIdSet = true;
    ESP.restart();
  });

  server.begin();
}

void onDataReceive(uint8_t *macAddr, uint8_t *incomingData, uint8_t len) {
  Serial.println("Data received");
  if (len == 6) {
    memcpy(hubMac, incomingData, 6);
    isMacReceived = true;
    Serial.println("MAC address received from HUB:");
    saveMacToFlash(hubMac);
    printMac(hubMac);
  }
}


void onDataSent(uint8_t *macAddr, uint8_t sendStatus) {
  pinMode(LED_BUILTIN, sendStatus == 0 ? LOW : HIGH);
  if (sendStatus == 0) {
    Serial.println("Data sent successfully");
    return;
  }
  Serial.print("Data send failed with status: ");
  Serial.println(sendStatus);
}


void setupEspNow() {
  Serial.println("Setting up ESP-NOW");
  if (esp_now_init() != 0) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
  esp_now_register_recv_cb(onDataReceive);
  esp_now_register_send_cb(onDataSent);
  Serial.println("ESP-NOW ready");
}


bool addPeer(uint8_t *macAddress) {
  if (esp_now_is_peer_exist(macAddress)) {
    Serial.println("Peer exists.");
    return true;
  }
  if (esp_now_add_peer(macAddress, ESP_NOW_ROLE_COMBO, 1, NULL, 0) != 0) {
    Serial.println("Failed to add peer.");
    return false;
  }
  Serial.println("Peer added.");
  return true;
}


void sendMacRequestBroadcast() {
  Serial.println("Sending broadcast to request MAC address...");
  uint8_t broadcastAddress[] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
  addPeer(broadcastAddress);

  DataPacket dataPacket;
  dataPacket.packetType = PACKET_TYPE_REQUEST_MAC;
  int status = esp_now_send(broadcastAddress, (uint8_t *)&dataPacket, sizeof(dataPacket));
  if (status != 0) {
    Serial.print("Error sending MAC request: ");
    Serial.println(status);
  }
}

float readBatteryVoltage() {
  int rawValue = analogRead(BATTERY_PIN);
  float voltage = (rawValue / ADC_MAX_VALUE) * REFERENCE_VOLTAGE * VOLTAGE_DIVIDER_RATIO;
  return voltage;
}

void sendDataToHub() {
  Serial.println("Sending data to hub.");


  int temperature = 0;
  int humidity = 0;
  dht11.readTemperatureHumidity(temperature, humidity);

  // Serial.print("Temperature: ");
  // Serial.print(temperature);
  // Serial.print(" °C\tHumidity: ");
  // Serial.print(humidity);
  // Serial.println(" %");

  DataPacket dataPacket = {
    .packetType = PACKET_TYPE_SENSOR_DATA,
    .temperature = temperature,
    .humidity = humidity,
    .batteryVoltage = readBatteryVoltage()
  };
  strncpy(dataPacket.deviceId, deviceId, DEVICE_ID_LENGTH);
  dataPacket.deviceId[DEVICE_ID_LENGTH - 1] = '\0';  // Ensure null-termination

  int status = esp_now_send(hubMac, (uint8_t *)&dataPacket, sizeof(dataPacket));
  if (status != 0) {
    Serial.print("Error sending data to hub: ");
    Serial.println(status);
  }
}


void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);

  if (!LittleFS.begin()) {
    Serial.println("Failed to mount LittleFS filesystem");
    return;
  }

  WiFi.mode(WIFI_STA);
  setupEspNow();

  if (loadDeviceIdFromFlash(deviceId)) {
    Serial.print("DeviceId Loaded from flash: ");
    Serial.println(deviceId);
    isDeviceIdSet = true;
  } else {
    Serial.println("Flash does not contain deviceId, setting up webserver");
    setupServer();
  }

  if (!isDeviceIdSet) {
    return;
  }

  if (loadMacFromFlash(hubMac)) {
    Serial.print("Loaded MAC from flash: ");
    printMac(hubMac);
    addPeer(hubMac);
    isMacReceived = true;
  } else {
    Serial.println("Flash does not contain hub MAC");
  }
}

void loop() {
  if (!isDeviceIdSet) {
    return;
  }

  if (!isMacReceived) {
    sendMacRequestBroadcast();
    delay(2000);
  } else {
    sendDataToHub();
    delay(500);
    Serial.println("Going in deepsleep");
    ESP.deepSleep(deepSleepIntervalMs * 1000);
  }
}
