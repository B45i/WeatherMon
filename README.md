# Hosting

firebase init hosting
npm run deplot

# Main dashboard

- Highest/Lowest temperature/humidity today.
- Low battery devices.
- Last week temp/humidly/battery chart.

# Device dashboard

- Temp heatmap
- Humidity heatmap
- temp, humidity, bat history (for selected period)

# Create index

```
  Collection ID: SensorData

| Field       | Order      |
|-------------|------------|
| lastSeen    | Descending |
| temperature | Ascending  |
| humidity    | Ascending  |
| battery     | Ascending  |
| temperature | Descending |
| humidity    | Descending |
| battery     | Descending |

```

# ESPTool commands

## Get port

`ls /dev/cu.*`

## Dump flash

`esptool.py --port /dev/cu.usbserial-537A0167731 --baud 115200 read_flash 0x00000 0x400000 flash_dump.bin`

- 0x00000: Starting address to read from.
- 0x400000: Size of the flash to read (adjust this based on your chip size, typically 4 MB for ESP8266).
- flash_dump.bin: File where the flash content will be saved.

`hexdump -C flash_dump.bin | less`

## Erase Flash

`esptool.py --port /dev/cu.usbserial-537A0167731 erase_flash`

## Verify the Erase

`esptool.py --port /dev/cu.usbserial-537A0167731 read_flash 0x00000 0x1000 flash_dump.bin`
`hexdump -C flash_dump.bin | less`
