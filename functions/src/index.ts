import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

const COLLECTIONS = {
  NODES: "SensorNodes",
  SENSOR_DATA: "SensorData",
};

const nodesCollection = db.collection(COLLECTIONS.NODES);
const sensorDataCollection = db.collection(COLLECTIONS.SENSOR_DATA);

export const logSensorData = onRequest(async (request, response) => {
  const { deviceId } = request.body;

  if (
    !deviceId ||
    request.body?.temperature === undefined ||
    request.body?.humidity === undefined ||
    request.body?.battery === undefined
  ) {
    response.status(400).send("Missing required fields.");
    return;
  }

  logger.info("New Log Request", deviceId);
  const nodeRef = nodesCollection.doc(deviceId);
  const nodeDoc = await nodeRef.get();

  if (!nodeDoc.exists) {
    logger.error("Node not found", deviceId);
    response.status(404).send("Node not found.");
    return;
  }

  const temperature = parseFloat(request.body.temperature);
  const humidity = parseFloat(request.body.humidity);
  const battery = parseFloat(request.body.battery);

  try {
    await nodeRef.update({
      temperature,
      humidity,
      battery,
      lastSeen: FieldValue.serverTimestamp(),
    });

    await sensorDataCollection.add({
      deviceId,
      temperature,
      humidity,
      battery,
      timestamp: FieldValue.serverTimestamp(),
    });
    logger.info("Data logged", deviceId);
    response.status(201).send("Data logged.");
  } catch (error) {
    logger.error(error);
    response.status(500).send("Error updating data.");
    return;
  }
});
