
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCFGLuUEo7GE3O7W9q24mWsEYpSqovaitw",
  authDomain: "photofolio-1b785.firebaseapp.com",
  projectId: "photofolio-1b785",
  storageBucket: "photofolio-1b785.appspot.com",
  messagingSenderId: "627397570850",
  appId: "1:627397570850:web:3d65ead491f111ff42b57b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);