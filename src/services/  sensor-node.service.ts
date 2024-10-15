import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
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
  const querySnapshot = await getDocs(collection(db, COLLECTIONS.NODES));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  }));
};
