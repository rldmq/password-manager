import React from 'react'
import { useOutletContext, Form, useActionData } from 'react-router-dom'
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'

import Toast from '../toast/Toast'
import SecretToggleButton from '../components/SecretToggleButton'

import { auth, autoLogout, authRequired, showToast } from '../assets/utils'

export async function loader({ request }){
    await authRequired(request)

    const path = new URL(request.url).pathname

    return path
}

export async function action({ request }){
    const formData = await request.formData()
    
    const firstName = formData.get('profile-firstname')
    const lastName = formData.get('profile-lastname')
    const purpose = formData.get('purpose')

    const displayName = `${firstName} ${lastName}`

    try{
        if(purpose === 'profile'){
            await updateProfile(auth.currentUser, {
                displayName: displayName,
            })
        }

        // there should be an incorrect password return for the password related items

        return `success-${Date.now()}`
    }catch(err){
        return `error-${Date.now()}`
    }
}

export default function Profile(){

    autoLogout()

    const theme = useOutletContext()

    const action = useActionData()

    const [userInfo, setUserInfo] = React.useState([])

    const [disabledProfileBtns, setDisabledProfileBtns] = React.useState(true)

    const [disabledEmailBtns, setDisabledEmailBtns] = React.useState(true)

    const [disabledPasswordBtns, setDisabledPasswordbtns] = React.useState(true)

    const [toastList, setToastList] = React.useState([])

    const { displayName, email } = userInfo
    
    const firstName = displayName?.split(' ')[0]
    const lastName = displayName?.split(' ').slice(1).join(' ')

    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    },[theme])

    React.useEffect(()=>{
        setUserInfo(auth.currentUser)
    }, [])

    React.useEffect(()=>{
        if(action){
            if(action.includes('success')){
                setDisabledProfileBtns(true)
                showToast('Success! Profile updated!', 'success', setToastList)
            }
            if(action.includes('error')){
                showToast('Error! Please refresh.', 'error', setToastList)
            }
        }
    },[action])

    function handleChangedProfileInput(){
        setDisabledProfileBtns(false)
    }

    function handleChangedEmailInput(){
        setDisabledEmailBtns(false)
    }

    function handleChangedPasswordInput(){
        setDisabledPasswordbtns(false)
    }

    function handleCancelEdits(type){
        if(type === 'profile'){
            setDisabledProfileBtns(true)
    
            document.getElementById('profile-firstname').value = firstName
            document.getElementById('profile-lastname').value = lastName
        }
        if(type === 'email'){
            setDisabledEmailBtns(true)
            document.getElementById('profile-email').value = email
        }
        if(type === 'password'){
            setDisabledPasswordbtns(true)

            document.getElementById('password-current').value = ''
            document.getElementById('password-new').value = ''
            document.getElementById('password-confirm').value = ''
        }
    }

    return (
        <>
        <main className='main main__profile'>
            <h1 className='profile__heading'>Profile</h1>
            <section className='profile__section'>
                <h2 className='profile__subheading'>Update Profile</h2>
                <Form method='post' className='profile__form'>
                    <label htmlFor='profile-firstname'
                    className='profile__label'>First Name</label>
                    <input 
                    className='profile__input'
                    id='profile-firstname' 
                    name='profile-firstname' 
                    type='text'
                    defaultValue={firstName}
                    onChange={()=>handleChangedProfileInput()} />

                    <label htmlFor='profile-lastname'
                    className='profile__label'>Last Name</label>
                    <input 
                    className='profile__input'
                    id='profile-lastname' 
                    name='profile-lastname' 
                    type='text'
                    defaultValue={lastName}
                    onChange={()=>handleChangedProfileInput()} />

                    <button
                    id='profile-edit-btn' 
                    className='profile__btn'
                    disabled={disabledProfileBtns}
                    >
                        Save
                    </button>

                    <button
                    id='profile-cancel-btn' 
                    className='profile__btn profile__btn_cancel'
                    disabled={disabledProfileBtns}
                    type='button'
                    onClick={()=>handleCancelEdits('profile')}>
                        Cancel
                    </button>

                    <input
                    type='text'
                    defaultValue='profile'
                    readOnly
                    name='purpose'
                    style={{
                        visibility: 'hidden', display: 'none'
                    }}
                    />
                </Form>
            </section>
            <hr />
            <section className='email__section'>
                <h2 className='profile__subheading'>Change Email</h2>
                <Form method='post' className='email__form'>
                    <label
                    htmlFor='profile-email'
                    className='profile__label'>Email</label>
                    <input
                    className='profile__input'
                    type='email'
                    id='profile-email'
                    name='profile-email'
                    onChange={handleChangedEmailInput}
                    defaultValue={email}/>

                    {!disabledEmailBtns && <><label htmlFor='profile-email-confirm'
                    className='profile__label'>Confirm New Email</label>
                    <input
                    className='profile__input'
                    type='email'
                    id='profile-email-confirm'
                    name='profile-email-confirm'
                    required
                    />

                    <label htmlFor='email-password'
                    className='profile__label'>Enter password to continue</label>
                    <div className='password__container'>
                        <input
                        className='profile__input'
                        type='password'
                        id='email-password'
                        name='email-password'
                        required/>
                        <SecretToggleButton inputId={'email-password'}/>
                    </div>
                    
                    </>}

                    <button 
                    className='profile__btn'
                    disabled={disabledEmailBtns}>Save</button>

                    <button 
                    className='profile__btn profile__btn_cancel'
                    disabled={disabledEmailBtns}
                    onClick={()=>handleCancelEdits('email')}>Cancel</button>

                    <input
                    type='text'
                    defaultValue='email'
                    readOnly
                    name='purpose'
                    style={{
                        visibility: 'hidden', display: 'none'
                    }}
                    />
                </Form>
            </section>
            <hr />

            {/* new password logic: cannot be the same as old password(?), must be at least 6 characters long, must have at least 1 uppercase character and 1 number  */}
            <section className='password__section'>
                <h2 className='profile__subheading'>Change Password</h2>
                <Form method='post' className='password__form'>
                    <label
                    className='profile__label'>Enter current password</label>
                    <div className='password__container'>
                        <input 
                        className='profile__input'
                        type='password' 
                        required
                        onChange={handleChangedPasswordInput}
                        id='password-current'
                        name='password-current'/>
                        <SecretToggleButton inputId={'password-current'} />
                    </div>

                    <label
                    className='profile__label'>Enter new password</label>
                    <div className='password__container'>
                        <input 
                        className='profile__input'
                        type='password' 
                        required
                        onChange={handleChangedPasswordInput}
                        id='password-new'
                        name='password-new'/>
                        <SecretToggleButton inputId={'password-new'} />
                    </div>

                    <label
                    className='profile__label'>Confirm new password</label>
                    <div className='password__container'>
                        <input 
                        className='profile__input'
                        type='password' 
                        required
                        onChange={handleChangedPasswordInput}
                        id='password-confirm'
                        name='password-confirm'/>
                        <SecretToggleButton inputId={'password-confirm'} />
                    </div>

                    <button 
                    className='profile__btn'
                    disabled={disabledPasswordBtns}>Save</button>

                    <button 
                    className='profile__btn profile__btn_cancel'
                    disabled={disabledPasswordBtns}
                    onClick={()=>handleCancelEdits('password')}>Cancel</button>

                    <input
                    type='text'
                    defaultValue='password'
                    readOnly
                    name='purpose'
                    style={{
                        visibility: 'hidden', display: 'none'
                    }}
                    />
                </Form>
            </section>
            <Toast toastList={toastList} context={theme}/>
        </main>
        </>
    )
}