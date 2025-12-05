// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// You can find this in the Firebase Console -> Project Settings -> General -> Your apps
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVljoMWoAo5ESGF5botfLntjGUFm5XSZk",
  authDomain: "portfolio08-58286.firebaseapp.com",
  projectId: "portfolio08-58286",
  storageBucket: "portfolio08-58286.firebasestorage.app",
  messagingSenderId: "446349304122",
  appId: "1:446349304122:web:2dc157ebe452e1a1aef003",
  measurementId: "G-3VC8W0TCMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
