import React from 'react'

import signupImage from '../assets/images/signup/secure-vault-portrait.png'

export default function Signup(){

    const firstNameInput = React.useRef()

    const [passwordless, setPasswordless] = React.useState(false)

    // const [password, setPassword] = React.useState('')

    // const [passwordConfirm, setPasswordConfirm] = React.useState('')

    const [signupFormData, setSignupFormData] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmpassword: ''
    })

    function handleSignupFormChanges(e){
        const {name,value} = e.target
        setSignupFormData(prev => ({
            ...prev,
            [name]:value,
        }))
    }

    function handleSignupSubmit(e){
        e.preventDefault()
        if(signupFormData.password !== signupFormData.confirmpassword){
            console.log("passwords do not match")
        }else{
            console.log('signed up! You will receive an email to set up your account.')
        }
    }

    const passwordInputsRender = (
        <>
            <label
            htmlFor='account-password'
            className='signup__label_password'
            >
                Password
            </label>
            <input
            type='password'
            id='account-password'
            placeholder='Enter password'
            name='password'
            onChange={handleSignupFormChanges}
            />

            <label
            htmlFor='account-password-confirm'
            className='signup__label_passwordconfirm'
            >
                Confirm Password
            </label>
            <input
            type='password'
            id='account-password-confirm'
            placeholder='Confirm password'
            name='confirmpassword'
            onChange={handleSignupFormChanges}
            />
        </>
    )

    React.useEffect(()=>{
        setTimeout(()=>{
            firstNameInput.current.focus()
        }, 500)
    },[])

    React.useEffect(()=>{

    },[])

    return (
        <main className="main main__signup">
            <div className='signup__hero'>
                <p className='signup__heading signup__heading_top'>Protect What's Important</p>
                <img
                src={signupImage}
                alt='Sign up for Password Manager'
                className='signup__img'
                />
                <p className='signup__heading signup__heading_bottom'>Sign up today!</p>
            </div>

            <form
            className='signup__form'
            >
                <h1 className='signup__heading'>Sign up</h1>
                <span className='signup__text'>It's quick and easy.</span>
                <label
                htmlFor='first-name'
                className='signup__label_firstname'
                >
                    First Name
                </label>

                <input
                type='text'
                id='first-name'
                placeholder='First name'
                ref={firstNameInput}
                name='firstname'
                onChange={handleSignupFormChanges}
                />

                <label
                htmlFor='last-name'
                className='signup__label_lastname'
                >
                    Last Name
                </label>
                
                <input
                type='text'
                id='last-name'
                placeholder='Last name'
                name='lastname'
                onChange={handleSignupFormChanges}
                />

                <label
                htmlFor='email'
                className='signup__label_email'
                >
                    E-mail
                </label>

                <input
                type='email'
                id='email'
                placeholder='firstname.lastname@example.com'
                name='email'
                onChange={handleSignupFormChanges}
                />

                <input 
                type='checkbox'
                id='passwordless-toggle'
                onClick={() => setPasswordless(v => !v)}
                data-info='info'
                />
                <label
                htmlFor='passwordless-toggle'
                className='signup__label_passwordless'
                data-info='info'
                >
                    Use Passwordless E-mail Authentication
                    <div className='tooltip'>
                        When logging in, instead of using a password, an e-mail will be sent to you containing a link that will give you access to your account.
                    </div>
                </label>

                        
                {!passwordless ? passwordInputsRender : null }

                <button
                onClick={(e)=>handleSignupSubmit(e)}
                className='signup__btn'
                >
                    Sign up
                </button>
            </form>
        </main>
    )
}

