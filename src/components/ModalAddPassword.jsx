import React from 'react'
import { Form, useOutletContext } from 'react-router-dom'
import SecretToggleButton from './SecretToggleButton'

export default function ModalAddPassword({ closeModal, submitData, userData}){

    const theme = useOutletContext()

    const purposeInput = React.useRef()

    const [sameNameError, setSameNameError] = React.useState(false)

    const [userInputsError, setUserInputsError] = React.useState([true,true,true])

    function checkUserInputsError(num,value){
        if(value !== null){
            setUserInputsError(prev => {
                const arr = [...prev]
                arr[num] = false
                return arr
            })
        }
        if(value === null){
            setUserInputsError(prev => {
                const arr = [...prev]
                arr[num] = true
                return arr
            })
        }
    }

    function handleNameError(nameInputValue){
        setSameNameError(userData?.some(e => e.f.toLowerCase() === nameInputValue.toLowerCase()))
    }

    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    },[theme])

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
                <input required type='text' placeholder='Work Email, Bank Login, etc...' id='account-purpose' name='account-purpose' ref={purposeInput} className='modal__input' onChange={(e)=>{
                    handleNameError(e.target.value)
                    checkUserInputsError(0, e.target.value)
                    }}/>
                {sameNameError && <p className='modal__error_name'>This label already exists.<br />Please specify a unique label.</p>}

                <label htmlFor='login' className='modal__label modal__label_login'>Login:</label>
                <input required type='text' placeholder='Enter Login' id='login' name='login' className='modal__input' onChange={(e)=>checkUserInputsError(1, e.target.value)}/>

                <label htmlFor='password' className='modal__label modal__label_password'>Password:</label>
                <div className='modal__password_container'>
                    <input required type='password' placeholder='Enter Password' id='password' name='password' className='modal__input' onChange={(e)=>checkUserInputsError(2, e.target.value)}/>
                    <SecretToggleButton inputId={'password'}/>
                </div>

                <button
                onClick={submitData} className='modal__btn modal__btn_add'
                disabled={userInputsError.some(e => e === true) || sameNameError}
                >Add</button>
                <button onClick={closeModal} className='modal__btn modal__btn_cancel'>Cancel</button>

                <input type='checkbox' name='edit' readOnly style={{visibility: 'hidden', display: 'none'}}/>
                <input type='text' name='url' defaultValue={window.location.href} readOnly style={{visibility: 'hidden', display: 'none'}}/>
            </Form>
        </div>
    )
}