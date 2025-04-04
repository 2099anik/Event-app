// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCM-2WeUBiSxasFKPfn1ThyG0Cmjy2OZBU",
  authDomain: "event-b887c.firebaseapp.com",
  projectId: "event-b887c",
  storageBucket: "event-b887c.firebasestorage.app",
  messagingSenderId: "64583289494",
  appId: "1:64583289494:web:5962e35a4c5b4b533a90b7",
  measurementId: "G-N6VB5PCCH7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };