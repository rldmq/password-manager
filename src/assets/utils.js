// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBR5mOctVTJXh5yK24jZc4yEj97mxRKDKc',
  authDomain: 'password-manager-4e071.firebaseapp.com',
  projectId: 'password-manager-4e071',
  storageBucket: 'password-manager-4e071.appspot.com',
//   messagingSenderId: '714651573878',
//   appId: '1:714651573878:web:bd7fd462e86e5b7fda0957'
  databaseURL: 'https://password-manager-4e071-default-rtdb.firebaseio.com/'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * Firebase Test Accounts:
 * L: scrimba@test.com K: Scrimba123 changed to L: real.person@email.com K: Pass123
 * L: scrimba2@test.com K: Scrimba123
 * L: jon.ube@email.com K: Abc123
 * L: jeebs.cheebs@nowhere.com K: Abc123
 */

import React from 'react'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { redirect, useLocation, useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js';

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

export function startSessionTimer(navigate, pathname){
  clearSessionTimer()

  sessionTimer = setTimeout(()=>{
        signOut(auth)
          .then(()=> {
            localStorage.clear()
            navigate(`/login?message=You%20have%20been%20signed%20out%20due%20to%20inactivity.${pathname ? `&redirect=${pathname}` : ''}`)
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

  const location = useLocation()

  React.useEffect(()=>{

      const timer = startSessionTimer(navigate, location.pathname)
      
      document.addEventListener('mousemove',timer)
      document.addEventListener('keypress', timer)

      return ()=>{
          document.removeEventListener('mousemove',timer)
          document.removeEventListener('keypress',timer)
          clearSessionTimer()
      }
  },[location])

}

export function generateId(){
  // Make sure that ID starts with a string
  let id = 'i'
  for(let i = 0; i < 6; i++){
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

export function showToast(message, type, setterFn, copyData){
  if(message.includes('clipboard')){
    navigator.clipboard.writeText(copyData)
  }
  const toastProperties = {
      id: Date.now(),
      body: message,
      type: type,
  }
  setterFn(prev => [...prev, toastProperties])
  setTimeout(()=>{
      setterFn(prev => {
          const list = [...prev]
          list.shift()
          return list
      })
  },2000)
}

export function handlePasswordStrength(password){
// Keep as separate variables so it's easier to read
  let charLengthCheck = false
  let upperCaseCheck = false
  let numCharCheck = false
  let spaceCheck = false

  // Check for minimum char length
  if(password.length >= 6){
    charLengthCheck = true
  }

  // Check for uppercase characters
  for(let i = 65; i <= 90; i++){
    if(password.includes(String.fromCharCode(i))){
        upperCaseCheck = true
        break
    }
  }

  // Check for number characters
  for(let i = 48; i <= 57; i++){
    if(password.includes(String.fromCharCode(i))){
        numCharCheck = true
        break
    }
  }

  // Check for space usage
  if(!password.includes(' ')){
      spaceCheck = true
  }

  if(charLengthCheck && upperCaseCheck && numCharCheck && spaceCheck){
    // Passed the checks
    return true
  }else{
    return false
  }
}

export function encryptData(password, type){
  if(type === 'login'){
    try{
      const key = auth.currentUser.uid
      const iv = { words: [ 7, 5, 2, 8 ], sigBytes: 16 }
      const data = CryptoJS.AES.encrypt(password, CryptoJS.enc.Utf8.parse(key), { iv }).toString()
      return data
    }catch(err){
      console.log(err)
    }
  }
  if(type === 'add'){
    try{
      const key = sessionStorage.getItem('pwm')
      const data = CryptoJS.AES.encrypt(password, key).toString()
      return data
    }catch(err){
      console.log(err)
    }
  }
}

export function decryptData(password){
  try{
    const key = sessionStorage.getItem('pwm')
    const bytes = CryptoJS.AES.decrypt(password, key)
    const data = bytes.toString(CryptoJS.enc.Utf8)
    return data
  }catch(err){
    console.log(err)
    return err
  }
}

// export async function handleDataUpdateAction(request){
//   const userID = auth.currentUser.uid

//   const db = getFirestore(app)
//   const dbRef = collection(db, userID)

//   const formData = await request.formData()

//   const purpose = formData.get('account-purpose')
//   const login = formData.get('login')
//   const password = formData.get('password')

//   if(formData.get('edit') === 'on'){
//     try{
//           await updateDoc(doc(dbRef,formData.get('docID')),{
//               f: purpose,
//               k: password,
//               l: login,
//               dateModified: serverTimestamp(),
//           })

//           return 'success-edit'
//           // return await Promise.reject(new Error('fail'))
//       }catch(err){
//           console.log(err)
//           return 'error'
//       }
//   }else{
//       try{
//           await setDoc((doc(dbRef)),{
//               f: purpose,
//               id: generateId(),
//               k: password,
//               l: login,
//               uid: userID,
//               dateCreated: serverTimestamp(),
//               dateModified: serverTimestamp(),
//           })
//           return 'success-add'
//       }catch(err){
//           console.log(err)
//           return 'error'
//       }

//   }

// }

export { firebaseConfig, app, auth }