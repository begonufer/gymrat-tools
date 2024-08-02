// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyACRqySLUcM_SigZ_oOxEeQlr28qC31gdk",
  authDomain: "gymrat-tools.firebaseapp.com",
  projectId: "gymrat-tools",
  storageBucket: "gymrat-tools.appspot.com",
  messagingSenderId: "1064040003032",
  appId: "1:1064040003032:android:b31b50de9a8283b3c02ead"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
