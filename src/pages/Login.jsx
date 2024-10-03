import React from 'react'
import { Link, Form, useActionData, useLoaderData, useNavigation, redirect } from 'react-router-dom'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../assets/utils'

// when wanting to go to the same url (eg: user tries to go to a nested route that requires auth, use redirect with new URL in loader - use URL .pathname)
// in the action is where we actually redirect to the desired path upon successful login using the request



export async function action({ request }){
    const formData = await request.formData()

    const email = formData.get('email')
    const password = formData.get('password')

    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        const pathname = new URL(request.url).searchParams.get('redirect') || '/account'

        // setlocalstorage login?? firebase??

        return redirect(pathname)
    }catch(err){
        return 'Email/password combination not found.'
    }
}

export function loader({ request }){
    const message = new URL(request.url).searchParams.get('message')
    return message
}

export default function Login(){

    const emailInput = React.useRef()

    const navigation = useNavigation()

    const message = useLoaderData()

    const error = useActionData()

    React.useEffect(()=>{
        setTimeout(()=>{
            emailInput.current.focus()
        },500)
    },[])

    return (
        <main className='main main__login'>
            <Form method='post' replace className='main__form'>

                <h1 className='main__title'>Log in to your account</h1>

                {message && <span className='form__message'>{message}</span>}

                {error && <span className='form__error'>{error}</span>}

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

                <input
                type='password'
                id='password'
                name='password'
                className='form__input'
                placeholder='Password'
                />

                <Link
                    to='/signup'
                    className='form__signup'
                >
                    Don't have an account? Sign up here!
                </Link>

                <button 
                disabled={navigation.state === 'submitting'}
                className='form__button'>
                    {navigation.state === 'idle' ? 'Login' : 'Logging in...'}
                </button>

            </Form>
        </main>
    )
}