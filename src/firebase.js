import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAiCbEd3VByP3EiF_vpoVCmzd5zrqNNyCw",
  authDomain: "career-lens-1ff47.firebaseapp.com",
  projectId: "careerlens-1ff47",
  storageBucket: "career-lens-1ff47.firebasestorage.app",
  messagingSenderId: "71402040334",
  appId: "1:71402040334:web:75099718b3dbb31b86a05f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);