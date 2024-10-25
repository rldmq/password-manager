import React from 'react'
import { useOutletContext, Form, useActionData } from 'react-router-dom'
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'

import Toast from '../toast/Toast'
import SecretToggleButton from '../components/SecretToggleButton'

import { auth, autoLogout, authRequired, showToast, handlePasswordStrength } from '../assets/utils'

export async function loader({ request }){
    await authRequired(request)

    const path = new URL(request.url).pathname

    return path
}

export async function action({ request }){
    // Consider redirects for email and password updates
    if(auth.currentUser.uid === 'EE2sxfglLLZLVD1gn6qdCAfW3OE3'){
        return `error-testacc-${Date.now()}`
    }
    try{
        const formData = await request.formData()
        
        const purpose = formData.get('purpose')
        
        if(purpose === 'profile'){
            const firstName = formData.get('profile-firstname')
            const lastName = formData.get('profile-lastname')
        
            const displayName = `${firstName} ${lastName}`
            try{
                await updateProfile(auth.currentUser, {
                    displayName: displayName,
                })
                return `success-${Date.now()}`
            }catch(err){
                return `error-${Date.now()}`
            }
        }
        if(purpose === 'email'){
            const newEmail = formData.get('profile-email')
            const newEmailConfirm = formData.get('profile-email-confirm')
            const password = formData.get('email-password')
            // Extra layer of email check
            if(newEmail === newEmailConfirm){
                try{
                    const credential = EmailAuthProvider.credential(auth.currentUser.email, password)
                    const result = await reauthenticateWithCredential(auth.currentUser, credential)
                    const update = await updateEmail(auth.currentUser, newEmail)

                    return `success-${Date.now()}`
                }catch(err){
                    if(err.code === 'auth/wrong-password'){
                        return `error-password-${Date.now()}`
                    }else{
                        return`error-${Date.now()}`
                    }
                }
            }else{
                return `error-${Date.now()}`
            }
        }
        if(purpose === 'password'){
            const password = formData.get('password-current')
            const newPassword = formData.get('password-new')
            const newPasswordConfirm = formData.get('password-confirm')
            // Extra layer of password check
            if(newPassword === newPasswordConfirm){
                try{
                    const credential = EmailAuthProvider.credential(auth.currentUser.email, password)
                    const result = await reauthenticateWithCredential(auth.currentUser, credential)
                    const update = await updatePassword(auth.currentUser, newPassword)
                }catch(err){
                    if(err.code === 'auth/wrong-password'){
                        return `error-password-${Date.now()}`
                    }else{
                        return `error-${Date.now()}`
                    }
                }
            }else{
                return `error-${Date.now()}`
            }
        }
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

    const [changedEmailInput, setChangedEmailInput] = React.useState(false)
    
    const [disableEmailSaveBtn, setDisableEmailSaveBtn] = React.useState(true)
    
    const [emailMatchError, setEmailMatchError] = React.useState(false)
    
    const [disablePasswordSaveBtn, setDisablePasswordSaveBtn] = React.useState(true)
    
    const [disablePasswordCancelBtn, setDisablePasswordCancelBtn] = React.useState(true)

    const [toastList, setToastList] = React.useState([])

    const [passwordStrengthError, setPasswordStrengthError] = React.useState(false)

    const [passwordMatchError, setPasswordMatchError] = React.useState(false)


    const { displayName, email } = userInfo
    
    const firstName = displayName?.split(' ')[0]
    const lastName = displayName?.split(' ').slice(1).join(' ')

    const hrStyle = {
        backgroundColor: theme === 'dark' ? 'white' 
        : 'var(--light-mode-text)',
        display: 'block',
        height: '2px',
        border: 'none',
    }

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
                // Reset profile form
                setDisabledProfileBtns(true)

                // Reset email form
                setChangedEmailInput(false)
                setDisableEmailSaveBtn(true)

                // Reset password form
                setDisablePasswordCancelBtn(true)
                setDisablePasswordSaveBtn(true)
                document.getElementById('password-current').value = ''
                document.getElementById('password-new').value = ''
                document.getElementById('password-confirm').value = ''

                // Show toast
                showToast('Success! Profile updated!', 'success', setToastList)
            }else if(action.includes('error-password')){
                showToast('Invalid password.', 'error', setToastList)
            }else if(action.includes('error-testacc')){
                showToast('No edits allowed on test account', 'error', setToastList)
            }else{
                showToast('Error! Please refresh.', 'error', setToastList)
            }
        }
    },[action])

    React.useEffect(()=>{
        const emptyEmailCheck = document.getElementById('profile-email').value
        if(!emailMatchError && changedEmailInput && emptyEmailCheck){
            setDisableEmailSaveBtn(false)
        }else{
            setDisableEmailSaveBtn(true)
        }
    },[emailMatchError])

    React.useEffect(()=>{
        const newPassEl = document.getElementById('password-new')?.value
        const confirmPassEl = document.getElementById('password-confirm')?.value

        if(!passwordMatchError && !passwordStrengthError && newPassEl && confirmPassEl){
            setDisablePasswordSaveBtn(false)
        }else{
            setDisablePasswordSaveBtn(true)
        }
    },[passwordMatchError, passwordStrengthError])

    function handleChangedProfileInput(){
        setDisabledProfileBtns(false)
    }

    function handleChangedEmailInput(){
        setChangedEmailInput(true)
    }

    function handleNewEmailMatch(e, id){
        let emailCheck
        if(id === 'profile-email'){
            emailCheck = document.getElementById('profile-email-confirm')?.value
        }
        if(id === 'profile-email-confirm'){
            emailCheck = document.getElementById('profile-email')?.value
        }

        if(e.target.value === emailCheck){
            setEmailMatchError(false)
        }else{
            setEmailMatchError(true)
        }
    }

    function handleChangedPasswordInput(){
        setDisablePasswordCancelBtn(false)
    }

    function handleNewPasswordChecks(password){
        const checker = handlePasswordStrength(password)
        if(checker){
            setPasswordStrengthError(false)
        }else{
            setPasswordStrengthError(true)
        }
    }

    function handleNewPasswordMatch(password, id){

        let newPassword

        if(id === 'password-new'){
            newPassword = document.getElementById('password-confirm').value
        }
        if(id === 'password-confirm'){
            newPassword = document.getElementById('password-new').value
        }

        const matcher = password === newPassword

        if(matcher){
            setPasswordMatchError(false)
        }else{
            setPasswordMatchError(true)
        }
    }

    function handleCancelEdits(type){
        if(type === 'profile'){
            setDisabledProfileBtns(true)
    
            document.getElementById('profile-firstname').value = firstName
            document.getElementById('profile-lastname').value = lastName
        }
        if(type === 'email'){
            setChangedEmailInput(false)
            setDisableEmailSaveBtn(true)
            document.getElementById('profile-email').value = email
        }
        if(type === 'password'){
            setDisablePasswordSaveBtn(true)
            setDisablePasswordCancelBtn(true)

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
                    className='profile__label profile__label_fn'>First Name</label>
                    <input 
                    className='profile__input'
                    id='profile-firstname' 
                    name='profile-firstname' 
                    type='text'
                    defaultValue={firstName ? firstName : ''}
                    placeholder={'First Name'}
                    onChange={()=>handleChangedProfileInput()} />

                    <label htmlFor='profile-lastname'
                    className='profile__label profile__label_ln'>Last Name</label>
                    <input 
                    className='profile__input'
                    id='profile-lastname' 
                    name='profile-lastname' 
                    type='text'
                    defaultValue={lastName ? lastName : ''}
                    placeholder={'Last Name'}
                    onChange={()=>handleChangedProfileInput()} />

                    <div className='profile__container_btns'>
                        <button
                        id='profile-edit-btn' 
                        className='profile__btn prof__btn_save'
                        disabled={disabledProfileBtns}
                        >
                            Save
                        </button>

                        <button
                        id='profile-cancel-btn' 
                        className='profile__btn profile__btn_cancel prof__btn_cancel'
                        disabled={disabledProfileBtns}
                        type='button'
                        onClick={()=>handleCancelEdits('profile')}>
                            Cancel
                        </button>
                    </div>

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
            <hr style={hrStyle}/>
            <section className='email__section'>
                <h2 className='profile__subheading'>Change Email</h2>
                <Form method='post' className='email__form'>
                    <label
                    htmlFor='profile-email'
                    className='profile__label profile__label_email'>Email</label>
                    <input
                    className='profile__input'
                    type='email'
                    id='profile-email'
                    name='profile-email'
                    onChange={(e)=>{
                        handleChangedEmailInput()
                        handleNewEmailMatch(e, 'profile-email')
                    }}
                    defaultValue={email}/>

                    {changedEmailInput && <><label htmlFor='profile-email-confirm'
                    className='profile__label profile__label_emailconfirm'>Confirm New Email</label>
                    <input
                    className='profile__input'
                    type='email'
                    id='profile-email-confirm'
                    name='profile-email-confirm'
                    required
                    placeholder='Confirm your new email'
                    onChange={(e)=>{
                        handleNewEmailMatch(e, 'profile-email-confirm')
                    }}
                    />
                    {emailMatchError && 
                    <div className='email__error'>
                        <p>Emails do not match.</p>    
                    </div>}

                    <label htmlFor='email-password'
                    className='profile__label profile__label_emailpassword'>Enter password for authentication</label>
                    <div className='password__container'>
                        <input
                        className='profile__input'
                        type='password'
                        id='email-password'
                        name='email-password'
                        required
                        placeholder='Enter your password'/>
                        <SecretToggleButton inputId={'email-password'}/>
                    </div>
                    
                    </>}

                    <div className='email__container_btns'>
                        <button 
                        className='profile__btn email__btn_save'
                        disabled={disableEmailSaveBtn}>Save</button>

                        <button 
                        className='profile__btn profile__btn_cancel email__btn_cancel'
                        type='button'
                        disabled={!changedEmailInput}
                        onClick={()=>handleCancelEdits('email')}>Cancel</button>
                    </div>

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
            <hr style={hrStyle}/>

            <section className='password__section'>
                <h2 className='profile__subheading'>Change Password</h2>
                <Form method='post' className='password__form'>
                    <label
                    className='profile__label profile__label_passwordcurrent'>Enter current password</label>
                    <div className='password__container'>
                        <input 
                        className='profile__input'
                        type='password' 
                        required
                        placeholder='Enter current password'
                        onChange={()=>{
                            handleChangedPasswordInput()
                            // handleAllowPasswordSave()
                        }}
                        id='password-current'
                        name='password-current'/>
                        <SecretToggleButton inputId={'password-current'} />
                    </div>

                    <label
                    className='profile__label profile__label_passwordnew'>Enter new password</label>
                    <div className='password__container'>
                        <input 
                        className='profile__input'
                        type='password' 
                        required
                        minLength='6'
                        placeholder='Enter new password'
                        onChange={(e)=>{
                            handleChangedPasswordInput()
                            handleNewPasswordChecks(e.target.value)
                            handleNewPasswordMatch(e.target.value, 'password-new')
                        }}
                        id='password-new'
                        name='password-new'/>
                        <SecretToggleButton inputId={'password-new'} />
                    </div>
                    {passwordStrengthError &&
                    <div className='password__error password__error_str'>
                        <p>New password must meet the following requirements:</p>
                        <ul>
                            <li>No whitespaces.</li>
                            <li>At least 6 characters long.</li>
                            <li>At least one number.</li>
                            <li>At least one uppercase character.</li>
                        </ul> 
                    </div>}

                    <label
                    className='profile__label profile__label_passwordconfirm'>Confirm new password</label>
                    <div className='password__container'>
                        <input 
                        className='profile__input'
                        type='password' 
                        required
                        placeholder='Confirm new password'
                        onChange={(e)=>{
                            handleChangedPasswordInput()
                            handleNewPasswordMatch(e.target.value, 'password-confirm')
                        }}
                        id='password-confirm'
                        name='password-confirm'/>
                        <SecretToggleButton inputId={'password-confirm'} />
                    </div>
                    {passwordMatchError && 
                    <div className='password__error password__error_match'>
                        <p>New passwords do not match.</p>
                    </div>}

                    <div className='password__container_btns'>
                        <button 
                        className='profile__btn password__btn_save'
                        disabled={disablePasswordSaveBtn}>Save</button>

                        <button 
                        className='profile__btn profile__btn_cancel password__btn_cancel'
                        disabled={disablePasswordCancelBtn}
                        onClick={()=>handleCancelEdits('password')}>Cancel</button>
                    </div>

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