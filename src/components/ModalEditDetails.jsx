import React from 'react'
import { Form } from 'react-router-dom'

export default function ModalEditDetails({submitData, closeModal, details}){

    const purposeInput = React.useRef()

    React.useEffect(()=>{
        purposeInput.current.focus()

        const handleBackgroundClick = function(e){
            if(e.target.classList.contains('modal__background')){
                closeModal()
            }
        }
        
        document.addEventListener('click', handleBackgroundClick)

        return () => {
            document.removeEventListener('click', handleBackgroundClick)
        }
    
    },[])

    return (
        <div className='modal__background'>
            <Form method='post' className='modal__form'>

                <h1 className='modal__heading'>Edit Details for "{details.name}"</h1>

                <label htmlFor='account-purpose' className='modal__label modal__label_purpose'>Label:</label>
                <input required type='text' defaultValue={details.name} id='account-purpose' name='account-purpose' ref={purposeInput} className='modal__input'/>

                <label htmlFor='login' className='modal__label modal__label_login'>Login:</label>
                <input required type='text' defaultValue={details.login} id='login' name='login' className='modal__input'/>

                <label htmlFor='password' className='modal__label modal__label_password'>Password:</label>
                <input required type='password' defaultValue={details.password} id='password' name='password' className='modal__input'/>

                <button onClick={submitData} className='modal__btn modal__btn_add'>Submit</button>
                <button onClick={closeModal} className='modal__btn modal__btn_cancel'>Cancel</button>

                <input type='checkbox' name='edit' checked readOnly style={{visibility: 'hidden', display: 'none'}}/>
                <input type='text' name='docID' value={details.id} readOnly style={{visibility: 'hidden', display: 'none'}}/>
            </Form>

        </div>
    )
}