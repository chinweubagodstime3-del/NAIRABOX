// FIREBASE APP
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";



// AUTH
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";



// FIRESTORE
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";



// STORAGE
import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";


// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAfmpuz5sQS8tzV4PcEELj24lvqwNx8ajA",
  authDomain: "nairabox-event.firebaseapp.com",
  projectId: "nairabox-event",
  storageBucket: "nairabox-event.firebasestorage.app",
  messagingSenderId: "642438790145",
  appId: "1:642438790145:web:0a7a8a644c49cfd3759400",
  measurementId: "G-91TWT78Q3C"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Firebase Services
const auth = getAuth(app);

const db = getFirestore(app);

// STORAGE
const storage = getStorage(app);




// EXPORTS
export {
    auth,
    db,
    storage
};