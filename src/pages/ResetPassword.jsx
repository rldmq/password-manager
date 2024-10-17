import React from 'react'
import { Form, useActionData, Link, useOutletContext } from 'react-router-dom'
import { auth } from '../assets/utils'
import { sendPasswordResetEmail } from 'firebase/auth'

import NotificationSlideUp from '../components/NotificationSlideUp'

// The count helps to refresh the value of the action data
let count = 0

let clearNotFoundError

export async function action({ request }){

    const formData = await request.formData()

    const email = formData.get('email')

    try{
        await sendPasswordResetEmail(auth,email)
        count++
        const val = `success-${count}`
        return val
    }catch(err){
        if(err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found'){
            count++
            return `not-found-${count}`
        }else{
            count++
            return `unknown-${count}`
        }
    }
}

export default function ResetPassword(){

    const theme = useOutletContext()

    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    },[theme])

    const emailInput = React.useRef()

    const [slideNotificationVis, setSlideNotificationVis] = React.useState(false)

    const [inlineError, setInlineError] = React.useState(null)

    const error = useActionData()

    React.useEffect(()=>{
        emailInput.current.focus()

        if(error){
            setInlineError(null)

            if(error.includes('success')){
                setSlideNotificationVis(true)
                document.getElementById('email').value = ''
                setTimeout(()=>{
                    setSlideNotificationVis(false)
                },3000)
            }else if(error.includes('not-found')){
                clearTimeout(clearNotFoundError)
                clearNotFoundError = setTimeout(()=>{
                    setInlineError(<p className='reset__error'>The email provided was not found.<br /><Link to='/signup' className='reset__error_link'>Need an account? Click here to sign up!</Link></p>)
                },100)
            }else if(error.includes('unknown')){
                clearTimeout(clearNotFoundError)
                clearNotFoundError = setTimeout(()=>{
                    setInlineError(<p className='reset__error'>Unknown error. Please refresh the page and try again or <Link to='/contact' className='reset__error_link'>contact our support team by clicking here</Link></p>)
                },100)
            }
        }
    }, [error])

    return (
        <main className='main main__reset'>
            <h1 className='reset__heading'>Password Recovery</h1>
            <Form method='post' className='reset__form'>
                <label htmlFor='email'>Enter your email below and we'll send you a secure link to reset your password.</label>
                <input type='email' id='email' name='email' placeholder='firstname.lastname@email.com' ref={emailInput}/>
                {inlineError}
                <button className='reset__btn_submit'>Submit</button>
            </Form>
            {slideNotificationVis && <NotificationSlideUp type={error} message={'Success! Email sent!'} context={theme}/>}
        </main>
    )
}