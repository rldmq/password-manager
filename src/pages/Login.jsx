import React from 'react'
import { Link, Form, useActionData, useLoaderData, useNavigation, redirect } from 'react-router-dom'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../assets/utils'

// action function
// useActionData for login errors

// when wanting to go to the same url (eg: user tries to go to a nested route that requires auth, use redirect with new URL in loader - use URL .pathname)
// in the action is where we actually redirect to the desired path upon successful login using the request

export async function action({ request }){
    const formData = await request.formData()

    const username = formData.get('username')
    const password = formData.get('password')

    try{
        const userCredential = await signInWithEmailAndPassword(auth, username, password)

        const user = userCredential.user
        // console.log(userCredential, user)
        
        const pathname = new URL(request.url).searchParams.get('redirect') || '/account'

        // setlocalstorage login?? firebase??

        throw redirect(pathname)
    }catch(err){
        return err
    }

    return null
}

export function loader({request, params}){
    const message = new URL(request.url).searchParams.get('message')
    return message
}

export default function Login(){

    const userNameInput = React.useRef()

    const navigation = useNavigation()

    const message = useLoaderData()

    const error = useActionData()

    console.log(error && error.code)

    React.useEffect(()=>{
        setTimeout(()=>{
            userNameInput.current.focus()
        },500)
    },[])

    return (
        <main className='main main__login'>
            <Form method='post' replace className='main__form'>

                <h1 className='main__title'>Log in to your account</h1>

                {message && <span className='form__message'>{message}</span>}

                <label
                    htmlFor='username'
                    className='form__label'
                >
                    Username:
                </label>

                <input
                type='text'
                id='username'
                name='username'
                className='form__input'
                placeholder='Username'
                ref={userNameInput}
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