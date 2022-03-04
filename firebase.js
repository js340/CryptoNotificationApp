import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBmBj3aIxqxJJlFeOuP_h94FPbsOv0GAkg",
  authDomain: "crypto-notification-app.firebaseapp.com",
  projectId: "crypto-notification-app",
  storageBucket: "crypto-notification-app.appspot.com",
  messagingSenderId: "181232423192",
  appId: "1:181232423192:web:1a2318f0221602391b8e6d",
  measurementId: "G-KJ0TBPE1H4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);