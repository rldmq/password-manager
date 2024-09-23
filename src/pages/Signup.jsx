import React from 'react'

export default function Signup(){

    const firstNameInput = React.useRef()

    React.useEffect(()=>{
        setTimeout(()=>{
            firstNameInput.current.focus()
        }, 500)
    },[])

    return (
        <main className="main main__signup">
            <img
            src=''
            alt='Sign up for Password Manager'
            className='signup__img'
            />
            <form
            className='signup__form'
            >
                <h1 className='signup__heading'>Sign up</h1>
                <span className='signup__text'>It's quick and easy.</span>
                <label
                htmlFor='first-name'
                className='signup__label_firstname'
                ref={firstNameInput}
                >
                    First Name
                </label>

                <input
                type='text'
                id='first-name'
                placeholder='First name'
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
                />

                <button
                onClick={(e)=>handleSignupSubmit(e)}
                className='signup__btn'
                >
                    Submit
                </button>

            </form>

        </main>
    )
}

function handleSignupSubmit(e){
    e.preventDefault()
    console.log('signed up! You will receive an email to set up your account.')
}