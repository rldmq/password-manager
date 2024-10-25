import React from 'react'
import { Link, Form, useActionData, useLoaderData, useNavigation, redirect, useOutletContext } from 'react-router-dom'

import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, encryptData } from '../assets/utils'
import SecretToggleButton from '../components/SecretToggleButton'

// when wanting to go to the same url (eg: user tries to go to a nested route that requires auth, use redirect with new URL in loader - use URL .pathname)
// in the action is where we actually redirect to the desired path upon successful login using the request

let count = 0
let clearLoginError
let clearLoginErrorVis

export async function action({ request }){

    const formData = await request.formData()

    const email = formData.get('email')
    const password = formData.get('password')

    try{
        await setPersistence(auth, browserSessionPersistence)
        await signInWithEmailAndPassword(auth, email, password)

        const pathname = new URL(request.url).searchParams.get('redirect') || '/account'

        const store = encryptData(password,'login')

        sessionStorage.setItem('pwm',store)

        return redirect(pathname)
    }catch(err){
        count++
        if(err.code === 'auth/invalid-email'
        || err.code === 'auth/invalid-credential'
        || err.code === 'auth/wrong-password'
        || err.code === 'auth/user-not-found'){
            return `not-found-${count}`
        }else if(err.code === 'auth/too-many-requests'){
            return `limit-reached-${count}`
        }else{
            return `unknown-${count}`
        }
    }
}

export function loader({ request }){
    const message = new URL(request.url).searchParams.get('message')
    return message
}

export default function Login(){

    const theme = useOutletContext()

    const emailInput = React.useRef()
    
    const navigation = useNavigation()
    
    const message = useLoaderData()
    
    const error = useActionData()
    
    const [loginError, setLoginError] = React.useState(null)
    
    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    },[theme])

    React.useEffect(()=>{
        setTimeout(()=>{
            emailInput.current.focus()
        },500)
    },[])

    React.useEffect(()=>{
        if(error?.includes('not-found')){
            setLoginError('Email/password combination not found.')
        }else if(error?.includes('limit-reached')){
            setLoginError('Firebase authentication limit reached. Please try again later.')
        }else if(error?.includes('unknown')){
            setLoginError('Unknown error. Please refresh the page.')
        }

        clearTimeout(clearLoginError)
        clearTimeout(clearLoginErrorVis)

        document.querySelector('.form__error')?.classList.remove('fade-out')

        clearLoginErrorVis = setTimeout(()=>{
            document.querySelector('.form__error')?.classList.add('fade-out')
        },2000)

        clearLoginError = setTimeout(()=>{setLoginError(null)},3500)

    },[error])


    return (
        <main className='main main__login'>
            <Form
            method='post'
            replace
            className='main__form'
            >
                <h1 className='main__title'>Log in to your account</h1>

                {message && <span className='form__message'>{message}</span>}

                {loginError && <span className='form__error'>{loginError}</span>}

                <label
                    htmlFor='email'
                    className='form__label'
                >
                    Email:
                </label>

                <input
                type='text'
                id='email'
                name='email'
                className='form__input'
                placeholder='Email'
                ref={emailInput}
                />

                <label
                htmlFor='password'
                className='form__label'
                >
                    Password:
                </label>

                <div className='form__password_container'>
                    <input
                    type='password'
                    id='password'
                    name='password'
                    className='form__input'
                    placeholder='Password'
                    />
                    <SecretToggleButton inputId={'password'}/>
                </div>

                <Link
                    to='/signup'
                    className='form__signup'
                >
                    Don't have an account? Sign up here!
                </Link>
                
                <button 
                type='submit'
                disabled={navigation.state === 'submitting'}
                className='form__button'>
                    {navigation.state === 'idle' ? 'Login' : 'Logging in...'}
                </button>

                <Link
                    to='/recover'
                    className='form__reset'
                >
                    Forgot your password? Click here!
                </Link>

            </Form>
        </main>
    )
}