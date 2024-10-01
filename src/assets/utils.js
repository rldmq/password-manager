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

export { firebaseConfig, app }

// scrimba@test.com
// Scrimba123

import { getAuth } from "firebase/auth"

const auth = getAuth(app)

export {auth}

// onAuthStateChanged for checking if sure is logged in or out

// enable google sign in?

import { redirect } from 'react-router-dom'

export function authRequired(request){

  const pathname = new URL(request.url).pathname || '/account'

  // grab from firebase?? local storage??
  const isLoggedIn = false
  
  if(!isLoggedIn){
    throw redirect(`/login?message=Please%20log%20in%20to%20your%20account.${pathname ? `&redirect=${pathname}` : ''}`)
  }
}