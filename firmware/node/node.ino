// ESP8266 Node.
#include <ESP8266WiFi.h>
#include <espnow.h>

struct DataPacket {
  float temperature = 25.5;      // Placeholder temperature
  float humidity = 60.0;         // Placeholder humidity
  float batteryVoltage = 3.7;    // Placeholder battery voltage
  uint32_t deviceId = 12345678;  // Placeholder device ID
};

DataPacket dataPacket;
uint8_t broadcastAddress[] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };  // Broadcast address
uint8_t esp32Mac[6];
bool macReceived = false;

// Callback when data is received
void onDataReceive(uint8_t *macAddr, uint8_t *incomingData, uint8_t len) {
  char macStr[18];
  snprintf(macStr, sizeof(macStr), "%02X:%02X:%02X:%02X:%02X:%02X",
           macAddr[0], macAddr[1], macAddr[2], macAddr[3], macAddr[4], macAddr[5]);
  Serial.print(macStr);
  if (len == 6) {  // Check if the payload contains a MAC address
    memcpy(esp32Mac, incomingData, 6);
    macReceived = true;
    Serial.println("MAC address received from ESP32:");
    for (int i = 0; i < 6; i++) {
      Serial.printf("%02X", esp32Mac[i]);
      if (i < 5) Serial.print(":");
    }
    Serial.println();
  }
}

// Callback when data is sent
void onDataSent(uint8_t *macAddr, uint8_t sendStatus) {
  Serial.println(sendStatus == 0 ? "Broadcast sent successfully" : "Broadcast failed");
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);

  if (esp_now_init() != 0) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
  esp_now_register_recv_cb(onDataReceive);
  esp_now_register_send_cb(onDataSent);

  // Add the broadcast peer
  esp_now_add_peer(broadcastAddress, ESP_NOW_ROLE_COMBO, 1, NULL, 0);
}

void loop() {
  if (!macReceived) {
    Serial.println("Sending broadcast to request MAC address...");
    esp_now_send(broadcastAddress, (uint8_t *)&dataPacket, sizeof(dataPacket));
    delay(2000);  // Retry every 2 seconds
  } else {
    Serial.println("MAC address obtained. Ready for direct communication.");
    delay(5000);  // Pause after obtaining the MAC
  }
}
