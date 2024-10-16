import React from 'react'
import { Form, useOutletContext } from 'react-router-dom'
import SecretToggleButton from './SecretToggleButton'

export default function ModalAddPassword({ closeModal, submitData }){

    const theme = useOutletContext()

    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    },[theme])

    const purposeInput = React.useRef()

    React.useEffect(()=>{
        purposeInput.current.focus()

        const handleBackgroundClick = function(e){
            if(e.target.classList.contains('modal__background')){
                closeModal()
            }
        }
        
        document.addEventListener('mousedown', handleBackgroundClick)

        return () => {
            document.removeEventListener('mousedown', handleBackgroundClick)
        }
    
    },[])

    return (
        <div className='modal__background'>
            <Form method='post' className='modal__form'>
                <h1 className='modal__heading'>Add New Account</h1>

                <label htmlFor='account-purpose' className='modal__label modal__label_purpose'>What is this account for?</label>
                <input required type='text' placeholder='Work Email, Bank Login, etc...' id='account-purpose' name='account-purpose' ref={purposeInput} className='modal__input'/>

                <label htmlFor='login' className='modal__label modal__label_login'>Login:</label>
                <input required type='text' placeholder='Enter Login' id='login' name='login' className='modal__input'/>

                <label htmlFor='password' className='modal__label modal__label_password'>Password:</label>
                <div className='modal__password_container'>
                    <input required type='password' placeholder='Enter Password' id='password' name='password' className='modal__input'/>
                    <SecretToggleButton inputId={'password'}/>
                </div>

                <button onClick={submitData} className='modal__btn modal__btn_add'>Add</button>
                <button onClick={closeModal} className='modal__btn modal__btn_cancel'>Cancel</button>

                <input type='checkbox' name='edit' readOnly style={{visibility: 'hidden', display: 'none'}}/>
            </Form>
        </div>
    )
}