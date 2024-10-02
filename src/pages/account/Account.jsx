import React from 'react'
import { Outlet } from 'react-router-dom'
import { authRequired } from '../../assets/utils'

export async function loader({ request }){
    await authRequired(request)
    return null
}

export default function Account(){

    return(
        <main className='main'>
            <h1>This is the account page</h1>
        </main>
    )
}