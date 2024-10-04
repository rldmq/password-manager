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

// scrimba@test.com // scrimba2@test.com
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
        resolve(user)
      }else{
        reject(redirect(`/login?message=Please%20log%20in%20to%20your%20account.${pathname ? `&redirect=${pathname}` : ''}`))
      }
    })
  })
}

import { signOut } from 'firebase/auth'

let sessionTimer

export function startSessionTimer(navigate){
  
  clearSessionTimer()
  
  sessionTimer = setTimeout(()=>{
        signOut(auth)
          .then(()=> {
            navigate('/login?message=You%20have%20been%20signed%20out%20due%20to%20inactivity.')
            })
          .catch((err)=>{
            console.log(err)
        })
    }, 900000)
    // 900000 = 15 mins
}

export function clearSessionTimer(){
  if(sessionTimer){
    clearTimeout(sessionTimer)
  }
}

import React from 'react'
import { useNavigate } from 'react-router-dom'

export function autoLogout(){
  const navigate = useNavigate()

  React.useEffect(()=>{
      startSessionTimer(navigate)
      
      document.addEventListener('mousemove',()=>{
          startSessionTimer(navigate)
      })
      document.addEventListener('keypress', ()=>{
          startSessionTimer(navigate)
      })

      return ()=>{
          document.removeEventListener('mousemove',startSessionTimer)
          document.removeEventListener('keypress',startSessionTimer)
          clearSessionTimer()
      }
  },[navigate])

}