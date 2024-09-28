// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-6db01.firebaseapp.com",
  projectId: "reactchat-6db01",
  storageBucket: "reactchat-6db01.appspot.com",
  messagingSenderId: "323148063496",
  appId: "1:323148063496:web:68896f122db3106ec142bd"
};
// console.log(import.meta.env.VITE_API_KEY);  


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// use in login or register using this authentication
export const auth = getAuth(app);
// use in to create our user info using this database
export const db = getFirestore(app);      
// use in login page to upload our images
export const storage = getStorage(app);   