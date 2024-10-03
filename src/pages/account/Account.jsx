import React from 'react'
import { Outlet } from 'react-router-dom'
import { authRequired, autoLogout } from '../../assets/utils'

export async function loader({ request }){
    await authRequired(request)
    return null
}

// need a greeting for user - means that on sign up, we have to take first name and update the user profile

export default function Account(){

    autoLogout()

    return(
        <main className='main'>
            <h1>This is the account page</h1>
        </main>
    )
}