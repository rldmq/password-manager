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

/**
 * Firebase Test Accounts:
 * L: scrimba@test.com K: Scrimba123
 * L: scrimba2@test.com K: Scrimba123
 * L: jon.ube@email.com K: Abc123
 * L: jeebs.cheebs@nowhere.com K: Abc123
 */

import React from 'react'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { redirect, useNavigate } from 'react-router-dom'

const auth = getAuth(app)

let sessionTimer

const chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

// enable google sign in?
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


export function generateId(){
  // Make sure that ID starts with a string
  let id = 'i'
  for(let i = 0; i < 6; i++){
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

export { firebaseConfig, app, auth }