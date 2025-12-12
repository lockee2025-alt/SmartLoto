// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwRghRtY33jX4HlFUSeEhsLoK92GFSa60",
  authDomain: "lokeesmartloto.firebaseapp.com",
  projectId: "lokeesmartloto",
  storageBucket: "lokeesmartloto.firebasestorage.app",
  messagingSenderId: "750350939409",
  appId: "1:750350939409:web:c5206898a4c63db5b288b0",
  measurementId: "G-781P4VETFJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export Firestore and helper functions
export { db, collection, query, where, orderBy, onSnapshot, getDocs };
