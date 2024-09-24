// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR5mOctVTJXh5yK24jZc4yEj97mxRKDKc",
  authDomain: "password-manager-4e071.firebaseapp.com",
  projectId: "password-manager-4e071",
  storageBucket: "password-manager-4e071.appspot.com",
//   messagingSenderId: "714651573878",
//   appId: "1:714651573878:web:bd7fd462e86e5b7fda0957"
  databaseURL: "https://password-manager-4e071-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);