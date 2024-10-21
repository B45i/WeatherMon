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
