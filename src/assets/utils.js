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

import { getAuth, onAuthStateChanged } from "firebase/auth"

const auth = getAuth(app)

export {auth}

// enable google sign in?

import { redirect } from 'react-router-dom'

export async function authRequired(request){
  return new Promise((resolve, reject) => {
    const pathname = new URL(request.url).pathname || '/account'
  
    onAuthStateChanged(auth, (user)=>{
      if(user){
        resolve()
      }else{
        reject(redirect(`/login?message=Please%20log%20in%20to%20your%20account.${pathname ? `&redirect=${pathname}` : ''}`))
      }
    })
  })
}

// export function handleExpiredSession(seconds){

// }

import { signOut } from "firebase/auth";

let expiredSessionTimer

export const handleExpiredSession = () => {
    if(expiredSessionTimer){
        clearTimeout(expiredSessionTimer)
    }

    expiredSessionTimer = setTimeout(()=>{
        signOut(auth)
        .then(()=>{
            console.log('signed out due to inactivity')
            throw redirect('/login')
        })
        .catch((err)=>{
            console.log(err)
        })
    }, (900000))
}

export { expiredSessionTimer }