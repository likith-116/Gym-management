import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyBfyb2YDrsKaq3aDeacEO9UxTsBRX4N-8E",
  authDomain: "gym-management-e81cb.firebaseapp.com",
  databaseURL: "https://gym-management-e81cb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gym-management-e81cb",
  storageBucket: "gym-management-e81cb.firebasestorage.app",
  messagingSenderId: "140117874702",
  appId: "1:140117874702:web:aee6253168cae3a11e045f",
  measurementId: "G-QVK13LMXG3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
