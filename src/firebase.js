import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDok5U-LzMJU5RMs8XN11yehpITgrSn4W4",
  authDomain: "finance-tracker-d1e79.firebaseapp.com",
  projectId: "finance-tracker-d1e79",
  storageBucket: "finance-tracker-d1e79.firebasestorage.app",
  messagingSenderId: "811825038052",
  appId: "1:811825038052:web:1651878fa1343a8d9f62f1",
  measurementId: "G-ERE939K54E"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
