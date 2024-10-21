import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyClpuOsKFV9MISieQG6ic39YN9RRvKkilE",
  authDomain: "fire-next-6ce5d.firebaseapp.com",
  projectId: "fire-next-6ce5d",
  storageBucket: "fire-next-6ce5d.appspot.com",
  messagingSenderId: "694685819533",
  appId: "1:694685819533:web:5ec98fc7f6ad155fa3b8c4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const COLLECTIONS = {
  NODES: "SensorNodes",
  SENSOR_DATA: "SensorData",
};

export { auth, app, db, COLLECTIONS };
