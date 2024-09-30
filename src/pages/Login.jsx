import React from 'react'
import { Link } from 'react-router-dom'

// loader function for login
// use request instead of params for the loader
// new URL grab searchParams

export default function Login(){

    const [userName, setUserName] = React.useState('')
    const [password, setPassword] = React.useState('')

    const userNameInput = React.useRef()

    React.useEffect(()=>{
        setTimeout(()=>{
            userNameInput.current.focus()
        },500)
    },[])

    return (
        <main className='main main__login'>
            <form className='main__form'>

                <h1 className='main__title'>Log in to your account</h1>

                <label
                    htmlFor='username'
                    className='form__label'
                >
                    Username:
                </label>

                <input
                type='text'
                id='username'
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
                type='text'
                id='password'
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
                className='form__button'
                onClick={(e)=>handleLoginSubmit(e)}
                >
                    Login
                </button>

            </form>
        </main>
    )
}

function handleLoginSubmit(e){
    e.preventDefault()
    console.log('hello')
}