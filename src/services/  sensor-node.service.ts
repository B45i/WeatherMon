import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { auth, COLLECTIONS, db } from "../firebase";

export const addSensorNode = async (node: any) => {
  const docRef = await addDoc(collection(db, COLLECTIONS.NODES), {
    ...node,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser?.uid,
  });
  return docRef.firestore.toJSON();
};

export const getDevices = async () => {
  const deviceQuery = query(
    collection(db, COLLECTIONS.NODES),
    orderBy("name", "asc")
  );
  const querySnapshot = await getDocs(deviceQuery);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    lastSeen: doc.data().lastSeen?.toDate(),
  }));
};
