import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 画像から抽出したあなたのFirebase設定
const firebaseConfig = {
  apiKey: "AIzaSyAcLLVv8VImiwWHjwg2YabVEckamQuBXLM",
  authDomain: "ito-online-7a5c9.firebaseapp.com",
  projectId: "ito-online-7a5c9",
  storageBucket: "ito-online-7a5c9.firebasestorage.app",
  messagingSenderId: "932130460438",
  appId: "1:932130460438:web:4c9e5063f5fe4bfb3ab637",
  measurementId: "G-55G00Q8DBQ",
};

// Firebaseの初期化（起動）とデータベースの準備
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
