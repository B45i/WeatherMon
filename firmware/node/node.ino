// ESP8266 Node.
#include <ESP8266WiFi.h>
#include <espnow.h>
#include <LittleFS.h>

struct DataPacket {
  float temperature = 25.5;      // Placeholder temperature
  float humidity = 60.0;         // Placeholder humidity
  float batteryVoltage = 3.7;    // Placeholder battery voltage
  uint32_t deviceId = 12345678;  // Placeholder device ID
};

DataPacket dataPacket;
const char *macFile = "/hub_mac.conf";
uint8_t hubMac[6];
bool macReceived = false;


void printMac(const uint8_t *mac) {
     for (int i = 0; i < 6; i++) {
      Serial.printf("%02X", mac[i]);
      if (i < 5) Serial.print(":");
    }
    Serial.println();
}

void saveMacToFlash(const uint8_t *mac) {
  File file = LittleFS.open(macFile, "w+");
  if (file) {
    file.write(mac, 6);
    file.close();
  }
}

bool loadMacFromFlash(uint8_t *mac) {
  if (!LittleFS.exists(macFile)) {
    return false;
  }

  File file = LittleFS.open(macFile, "r");
  if (!file) {
    return false;
  }

  file.read(mac, 6);
  file.close();
  return true;
}

void onDataReceive(uint8_t *macAddr, uint8_t *incomingData, uint8_t len) {
  Serial.println("Data received");
  if (len == 6) {
    memcpy(hubMac, incomingData, 6);
    macReceived = true;
    Serial.println("MAC address received from HUB:");
    saveMacToFlash(hubMac);
    printMac(hubMac);
  }
}

void onDataSent(uint8_t *macAddr, uint8_t sendStatus) {
  Serial.println(sendStatus == 0 ? "Broadcast sent successfully" : "Broadcast failed");
  // todo: Intiate re-pairing after few tries, make inbuilt glow if data failed.
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

void sendMacRequestBroadcast() {
  Serial.println("Sending broadcast to request MAC address...");
  uint8_t broadcastAddress[] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };  // Broadcast address
  if (!esp_now_is_peer_exist(broadcastAddress)) {
    if (esp_now_add_peer(broadcastAddress, ESP_NOW_ROLE_COMBO, 1, NULL, 0) != 0) {
      Serial.println("Failed to add peer");
      return;
    }
  } else {
    Serial.println("Peer exists.");
  }

  esp_now_send(broadcastAddress, (uint8_t *)&dataPacket, sizeof(dataPacket));
}

void sendDataToHub() {
  Serial.println("Sending data to hub...");
  int status = esp_now_send(hubMac, (uint8_t *)&dataPacket, sizeof(dataPacket));
  if (status != 0) {
    Serial.print("Error sending data to hub: ");
    Serial.println(status);
  }
}

void setup() {
  Serial.begin(115200);
  if (!LittleFS.begin()) {
    Serial.println("Failed to mount LittleFS filesystem");
    return;
  }
  WiFi.mode(WIFI_STA);
  setupEspNow();

  if (loadMacFromFlash(hubMac)) {
    Serial.print("Loaded MAC from flash: ");
    printMac(hubMac);
    macReceived = true;
    // addHubAsPeer();
  } else {
    Serial.println("Flash don't have hub MAC");
  }
}

void loop() {
  if (!macReceived) {
    sendMacRequestBroadcast();
    delay(2000);  // Retry every 2 seconds
  } else {
    Serial.println("MAC address obtained. Ready for direct communication.");
    delay(5000);  // Pause after obtaining the MAC
    sendDataToHub();
  }
}
