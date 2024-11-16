// ESP8266 Node.
#include <ESP8266WiFi.h>
#include <espnow.h>
#include <LittleFS.h>


enum PacketType {
  PACKET_TYPE_REQUEST_MAC = 1,
  PACKET_TYPE_SENSOR_DATA = 2
};


struct DataPacket {
  PacketType packetType = PACKET_TYPE_SENSOR_DATA;
  float temperature = 26.0;
  float humidity = 60.0;
  float batteryVoltage = 3.7;
  char deviceId[16];
};


const char *MAC_FILE = "/hub_mac.conf";
uint8_t hubMac[6];
bool isMacReceived = false;


void printMac(const uint8_t *mac) {
  for (int i = 0; i < 6; i++) {
    Serial.printf("%02X", mac[i]);
    if (i < 5) Serial.print(":");
  }
  Serial.println();
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
  Serial.println(sendStatus == 0 ? "Data sent successfully" : "Data send failed");
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


void sendDataToHub() {
  DataPacket dataPacket;
  dataPacket.packetType = PACKET_TYPE_SENSOR_DATA;
  strncpy(dataPacket.deviceId, "NewDevice123", sizeof(dataPacket.deviceId));
  Serial.println("Sending data to hub...");
  int status = esp_now_send(hubMac, (uint8_t *)&dataPacket, sizeof(dataPacket));
  if (status != 0) {
    Serial.print("Error sending data to hub: ");
    Serial.println(status);
  }
}


void setup() {
  // pinMode(LED_BUILTIN, OUTPUT);
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
    addPeer(hubMac);
    isMacReceived = true;
  } else {
    Serial.println("Flash does not contain hub MAC");
  }
}


void loop() {
  if (!isMacReceived) {
    sendMacRequestBroadcast();
    delay(2000);
  } else {
    Serial.println("MAC address obtained. Ready for direct communication.");
    delay(5000);
    sendDataToHub();
  }
}
