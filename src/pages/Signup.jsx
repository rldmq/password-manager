import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import InputFieldError from '../components/InputFieldError'

import signupImage from '../assets/images/signup/secure-vault-portrait.png'
import successGif from '../assets/images/signup/icons8-success-green.gif'

import SecretToggleButton from '../components/SecretToggleButton'
import Toast from '../toast/Toast'

import { showToast } from '../assets/utils'

// Firebase
import { app, handlePasswordStrength } from '../assets/utils'
import { getAuth,
        createUserWithEmailAndPassword,
        sendSignInLinkToEmail,
        updateProfile,
        signOut} 
        from 'firebase/auth'
        
const auth = getAuth(app)

export default function Signup(){

    const theme = useOutletContext()

    const [signupErr, setSignupErr] = React.useState('')
    
    const navigate = useNavigate()
    
    const firstNameInput = React.useRef()
    
    const [passwordless, setPasswordless] = React.useState(false)
    
    const [signupFormData, setSignupFormData] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmpassword: '',
        passwordCharCheck: false,
        passwordlessToggle: false,
    })

    const [toastList, setToastList] = React.useState([])
    
    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    },[theme])
    
    // Focus on the first input field on load
    React.useEffect(()=>{
        setTimeout(()=>{
            firstNameInput.current.focus()
        }, 500)
    },[])

    React.useEffect(()=>{
        if(signupErr.includes('exists')){
            showToast('Email already exists.', 'error', setToastList)
        }
    },[signupErr])

    function handleSignupFormChanges(e){

        if(e.target.getAttribute('id') !== 'passwordless-toggle'){
            const {name,value} = e.target
            setSignupFormData(prev => ({
                ...prev,
                [name]:value,
            }))
        }

        // Check password strength
        if(e.target.getAttribute('id') === 'account-password'){
            handlePasswordStrengthCheck(e)
        }
        // handlePasswordStrengthCheck(e)

        // Check if passwords match
        if(e.target.getAttribute('id') === 'account-password-confirm' || e.target.getAttribute('id') === 'account-password'){
            handlePasswordMatchCheck(e)
        }
        // handlePasswordMatchCheck(e)

        // Check for passwordless toggle
        if(e.target.getAttribute('id') === 'passwordless-toggle'){
            setSignupFormData(prev=>({
                ...prev,
                passwordlessToggle: e.target.checked
            }))
        }
    }

    function handlePasswordStrengthCheck(e){

        const passwordErrorEl = document.querySelector('.signup__password_error')

        const checker = handlePasswordStrength(e.target.value)

        setSignupFormData(prev => ({
            ...prev,
            'passwordCharCheck' : checker ? true : false
        }))
        
        
        if(!checker){
            passwordErrorEl.style.display = 'block'

        }else{
            passwordErrorEl.style.display = 'none'
        }
    }

    function handlePasswordMatchCheck(e){
        const passwordErrorEl = document.querySelector('.signup__passwordconfirm_error')

        if(signupFormData.password !== e.target.value){
            passwordErrorEl.style.display = 'block'
        }
        
        else{
            passwordErrorEl.style.display = 'none'
        }
    }

    async function handleSignupSubmit(){

        // If user tries to submit with empty fields, add a shake animation to the *Required text
        const reviewEls = document.querySelectorAll('.input-field-error')
        if(!signupFormData.passwordlessToggle && (signupFormData.password !== signupFormData.confirmpassword || !signupFormData.passwordCharCheck)){
            shakeErrorEls(reviewEls)
        }else if(signupFormData.firstname.trim() === ''){
            shakeErrorEls(reviewEls)
        }else if(signupFormData.lastname.trim() === ''){
            shakeErrorEls(reviewEls)
        }

        else{
            // Passwordless disabled for now
            if(signupFormData.passwordlessToggle){
                // !!!!!!!!!! update the url !!!!!!!!!!
                const acs = {
                    url: 'https://save-my-timers.netlify.app/',
                    // This must be true.
                    handleCodeInApp: true,
                    // iOS: {
                    //     bundleId: 'com.example.ios'
                    // },
                    // android: {
                    //     packageName: 'com.example.android',
                    //     installApp: true,
                    //     minimumVersion: '12'
                    // },
                    // dynamicLinkDomain: 'example.page.link'
                }
                // sendSignInLinkToEmail(auth, signupFormData.email, acs)
                //     .then(()=>{
                //         window.localStorage.setItem('emailForSignIn',email)
                //     })
                // overrideEl.innerHTML += 
                // `<p>Please check your email for the sign-in link.</p>`
            }else{
                try{
                    await createUserWithEmailAndPassword(auth, signupFormData.email, signupFormData.password)
                    await updateProfile(auth.currentUser, {
                        displayName: `${signupFormData.firstname} ${signupFormData.lastname}`
                        })
                    await signOut(auth)
                    // Creating an element to replace the form, if submitting is successful (could have been useState)
                    const overrideEl = document.querySelector('.signup__form')
                    overrideEl.classList.add('signup__success')
                    overrideEl.innerHTML = 
                    `
                    <img src=${successGif} class='success__img'/>

                    <h1 class='success__msg'>Success!</h1>`
                    overrideEl.innerHTML += 
                    `<p>You will now be redirected to the login page.</p>`
                    setTimeout(()=>{
                        navigate('/login')
                    },2000)
                }catch(err){
                    console.log(err)
                    setSignupErr(`exists-${Date.now()}`)
                }
                // createUserWithEmailAndPassword(auth, signupFormData.email, signupFormData.password)
                //     .then(()=> {
                //         updateProfile(auth.currentUser, {
                //         displayName: `${signupFormData.firstname} ${signupFormData.lastname}`
                //         })
                //         // .then(()=>{
                //             signOut(auth)
                //             overrideEl.innerHTML += 
                //             `<p>You will now be redirected to the login page.</p>`

                //             setTimeout(()=>{
                //                 navigate('/login')
                //             },2000)
                //         // }).catch(err => console.log(err))
                //     })
                //     .catch(err => {
                //         console.log(err)
                //         setSignupErr(`exists-${Date.now()}`)
                //     })
                
            }
        }
    }

    function shakeErrorEls(errorEls){
        for(let el of errorEls){
            el.classList.add('shake')
        }
        setTimeout(()=>{
            for(let el of errorEls){
                el.classList.remove('shake')
            }
        }, 1000)
    }

    const passwordInputsRender = (
        <>
            <label
            htmlFor='account-password'
            className='signup__label_password'
            >
                Password
                <InputFieldError
                message={'Required'}
                visibility={signupFormData.password.trim() !== ''}
                />
            </label>
            <div className='signup__password_container'>
                <input
                type='password'
                id='account-password'
                placeholder='Enter password'
                name='password'
                onChange={handleSignupFormChanges}
                minLength={6}
                required
                />
                <SecretToggleButton inputId={'account-password'}/>
            </div>

            <div className='signup__password_error'>
                <p>Password must meet the following requirements:</p>
                <ul>
                    <li>No whitespaces.</li>
                    <li>At least 6 characters long.</li>
                    <li>At least one number.</li>
                    <li>At least one uppercase character.</li>
                </ul> 
            </div>

            <label
            htmlFor='account-password-confirm'
            className='signup__label_passwordconfirm'
            >
                Confirm Password
                <InputFieldError
                message={'Required'}
                visibility={signupFormData.confirmpassword.trim() !== ''}
                />
            </label>
            <div className='signup__passwordconfirm_container'>
                <input
                type='password'
                id='account-password-confirm'
                placeholder='Confirm password'
                name='confirmpassword'
                onChange={handleSignupFormChanges}
                required
                minLength={6}
                />
                <SecretToggleButton inputId={'account-password-confirm'}/>
            </div>

            <div className='signup__passwordconfirm_error'>
                <p>Passwords do not match.</p>
            </div>
        </>
    )

    // Unsure if it's worth converting form to React Router Form
    return (
        <main className='main main__signup'>
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
            onSubmit={e => e.preventDefault()}
            >
                <h1 className='signup__heading'>Sign up</h1>
                <span className='signup__text'>It's quick and easy.</span>
                <label
                htmlFor='first-name'
                className='signup__label_firstname'
                >
                    First Name
                    <InputFieldError
                    message={'Required'}
                    visibility={signupFormData.firstname.trim() !== ''}
                    />
                </label>

                <input
                type='text'
                id='first-name'
                placeholder='First name'
                ref={firstNameInput}
                name='firstname'
                onChange={handleSignupFormChanges}
                required
                />

                <label
                htmlFor='last-name'
                className='signup__label_lastname'
                >
                    Last Name
                    <InputFieldError
                    message={'Required'}
                    visibility={signupFormData.lastname.trim() !== ''}
                    />
                </label>
                
                <input
                type='text'
                id='last-name'
                placeholder='Last name'
                name='lastname'
                onChange={handleSignupFormChanges}
                required
                />

                <label
                htmlFor='email'
                className='signup__label_email'
                >
                    E-mail
                    <InputFieldError
                    message={'Required'}
                    visibility={signupFormData.email.trim() !== ''}
                    />
                </label>

                <input
                type='email'
                id='email'
                placeholder='firstname.lastname@example.com'
                name='email'
                onChange={handleSignupFormChanges}
                required
                />

                <input 
                type='checkbox'
                id='passwordless-toggle'
                onClick={() => setPasswordless(v => !v)}
                onChange={handleSignupFormChanges}
                data-info='info'
                />
                <label
                htmlFor='passwordless-toggle'
                className='signup__label_passwordless'
                data-info='info'
                >
                    Use Passwordless E-mail Authentication
                    <div className='tooltip'>
                        When logging in, instead of using a password, an e-mail will be sent to you containing a link that will give you access to your account. <span style={{color: 'red'}}>Currently disabled.</span>
                    </div>
                </label>

                        
                {!passwordless ? passwordInputsRender : null }

                <button
                onClick={()=>handleSignupSubmit()}
                className='signup__btn'
                >
                    Sign up
                </button>
            </form>
            <Toast toastList={toastList} context={theme}/>
        </main>
    )
}