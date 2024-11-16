// ESP32 Hub
#include <WiFi.h>
#include <esp_now.h>

enum PacketType {
  PACKET_TYPE_REQUEST_MAC = 1,
  PACKET_TYPE_SENSOR_DATA = 2
};

struct DataPacket {
  PacketType packetType = PACKET_TYPE_SENSOR_DATA;
  float temperature;
  float humidity;
  float batteryVoltage;
  char deviceId[16] = {};
};

void handleMacRequest(const uint8_t *srcAddr) {
  uint8_t esp32Mac[6];
  WiFi.macAddress(esp32Mac);
  checkAndAddPeer(srcAddr);
  int status = esp_now_send(srcAddr, esp32Mac, sizeof(esp32Mac));
  if (status != 0) {
    Serial.println("Failed to send MAC address back to sender.");
    return;
  }
  Serial.println("Sent MAC address back to sender.");
}

void handleSensorData(const uint8_t *incomingData) {
  DataPacket dataPacket = {};
  memcpy(&dataPacket, incomingData, sizeof(DataPacket));
  Serial.print("Temperature: ");
  Serial.println(dataPacket.temperature);
  Serial.print("Humidity: ");
  Serial.println(dataPacket.humidity);
  Serial.print("Battery Voltage: ");
  Serial.println(dataPacket.batteryVoltage);
  Serial.print("Device ID: ");
  Serial.println(dataPacket.deviceId);
}

void checkAndAddPeer(const uint8_t *nodeMac) {
  if (esp_now_is_peer_exist(nodeMac)) {
    return;
  }
  esp_now_peer_info_t peerInfo = {};
  memcpy(peerInfo.peer_addr, nodeMac, 6);
  peerInfo.channel = 1;
  peerInfo.encrypt = false;
  if (esp_now_add_peer(&peerInfo) == ESP_OK) {
    Serial.println("Node added as peer.");
    return;
  }
  Serial.println("Failed to add Node as peer.");
}

void onDataReceive(const esp_now_recv_info *recvInfo, const uint8_t *incomingData, int len) {
  DataPacket incomingPacket;
  memcpy(&incomingPacket, incomingData, sizeof(DataPacket));

  Serial.print("Data received, packetType: ");
  Serial.println(incomingPacket.packetType);

  if (incomingPacket.packetType == PACKET_TYPE_REQUEST_MAC) {
    handleMacRequest(recvInfo->src_addr);
  } else if (incomingPacket.packetType == PACKET_TYPE_SENSOR_DATA) {
    handleSensorData(incomingData);
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);

  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  esp_now_register_recv_cb(onDataReceive);
}

void loop() {
}
