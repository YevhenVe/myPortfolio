import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_API_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_API_PROJECT_ID,
    storageBucket: import.meta.env.VITE_API_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_API_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_API_APP_ID
};

const app = initializeApp(firebaseConfig);
const fireStore = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { fireStore, auth, googleProvider, database };
