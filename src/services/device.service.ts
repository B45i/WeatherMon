import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";

import { auth, COLLECTIONS, db } from "../firebase";
import { Device, DeviceData, TimePeriod, ValueKeys } from "../types";
import { getStartTime } from "../utils";

const deviceCollection = collection(db, COLLECTIONS.NODES);
const sensorDataCollection = collection(db, COLLECTIONS.SENSOR_DATA);

export const addSensorNode = async (node: Device) => {
  const docRef = await addDoc(deviceCollection, {
    ...node,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.uid,
  });
  return docRef.firestore.toJSON();
};

export const getDevices = async (): Promise<Array<Device> | undefined> => {
  const deviceQuery = query(deviceCollection, orderBy("name", "asc"));
  const querySnapshot = await getDocs(deviceQuery);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        lastSeen: doc.data().lastSeen?.toDate(),
      } as Device)
  );
};

export const getDevice = async (id: string): Promise<Device | undefined> => {
  const docRef = doc(db, COLLECTIONS.NODES, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return undefined;
  }

  return {
    ...docSnap.data(),
    id: docSnap.id,
    createdAt: docSnap.data()?.createdAt.toDate(),
    lastSeen: docSnap.data()?.lastSeen?.toDate(),
  } as Device;
};

export const maxMinStats = async (
  id: string,
  key: ValueKeys,
  timePeriod: TimePeriod,
  extremaType: "max" | "min"
): Promise<DeviceData> => {
  const order = extremaType === "max" ? "desc" : "asc";

  const valQuery = query(
    sensorDataCollection,
    where("deviceId", "==", id),
    where("timestamp", ">=", Timestamp.fromDate(getStartTime(timePeriod))),
    orderBy(key, order),
    limit(1)
  );
  const querySnapshot = await getDocs(valQuery);
  const val = querySnapshot.docs[0]?.data();
  return { ...val, timestamp: val?.timestamp.toDate() } as DeviceData;
};

export const getDeviceTimeSeriesData = async (
  id: string,
  timePeriod: TimePeriod
): Promise<Array<DeviceData>> => {
  const valQuery = query(
    sensorDataCollection,
    where("deviceId", "==", id),
    where("timestamp", ">=", Timestamp.fromDate(getStartTime(timePeriod))),
    orderBy("timestamp", "asc")
  );

  const querySnapshot = await getDocs(valQuery);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      } as DeviceData)
  );
};
