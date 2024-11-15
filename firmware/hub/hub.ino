// ESP32 Hub

#include <WiFi.h>
#include <esp_now.h>

// Structure to hold received data
struct DataPacket {
  float temperature;
  float humidity;
  float batteryVoltage;
  uint32_t deviceId;
};

DataPacket dataPacket;

// Callback function for receiving data
void onDataReceive(const esp_now_recv_info *recvInfo, const uint8_t *incomingData, int len) {
  if (len == sizeof(DataPacket)) {
    memcpy(&dataPacket, incomingData, sizeof(dataPacket));
    Serial.print("Temperature: ");
    Serial.println(dataPacket.temperature);
    Serial.print("Humidity: ");
    Serial.println(dataPacket.humidity);
    Serial.print("Battery Voltage: ");
    Serial.println(dataPacket.batteryVoltage);
    Serial.print("Device ID: ");
    Serial.println(dataPacket.deviceId);

    uint8_t esp8266_mac[6];
    memcpy(esp8266_mac, recvInfo->src_addr, 6);
    Serial.print(esp8266_mac[0]);
    Serial.print(esp8266_mac[1]);
    Serial.print(esp8266_mac[2]);
    Serial.print(esp8266_mac[3]);
    Serial.print(esp8266_mac[4]);
    Serial.print(esp8266_mac[5]);



    if (!esp_now_is_peer_exist(esp8266_mac)) {
      esp_now_peer_info_t peerInfo = {};
      memcpy(peerInfo.peer_addr, esp8266_mac, 6);
      peerInfo.channel = 1;  // Ensure both devices use the same Wi-Fi channel
      peerInfo.encrypt = false;
      if (esp_now_add_peer(&peerInfo) == ESP_OK) {
        Serial.println("ESP8266 added as peer.");
      } else {
        Serial.println("Failed to add ESP8266 as peer.");
        return;
      }
    }

    // Send ESP32's MAC address back to ESP8266
    uint8_t esp32Mac[6];
    WiFi.macAddress(esp32Mac);
    esp_now_send(esp8266_mac, esp32Mac, 6);
    Serial.println("Sent MAC address back to sender.");
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);

  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Register callback for received data
  esp_now_register_recv_cb(onDataReceive);
}

void loop() {
  // Do nothing, as ESP-NOW callback handles data
}
