// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage'
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDIdZRzK5LyzJTtSSRwir9eZ6-GGKJt0mE",
    authDomain: "bengkel-muslimah.firebaseapp.com",
    projectId: "bengkel-muslimah",
    storageBucket: "bengkel-muslimah.appspot.com",
    messagingSenderId: "147020360156",
    appId: "1:147020360156:web:142c13fad9de85541bc719",
    measurementId: "G-44RR8LVRJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)