// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_uiHcJqURwv9UIOJr-S_PuyXlV6Wf1ak",
  authDomain: "survivor-league-2f6be.firebaseapp.com",
  projectId: "survivor-league-2f6be",
  storageBucket: "survivor-league-2f6be.appspot.com",
  messagingSenderId: "467572719836",
  appId: "1:467572719836:web:9f928e393ef919f4eb7419"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db};