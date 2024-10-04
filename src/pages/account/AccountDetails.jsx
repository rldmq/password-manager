import React from 'react'
import { useOutletContext, useLoaderData } from 'react-router-dom'

import { authRequired } from '../../assets/utils'

export async function loader({ request }){

    await authRequired(request)

    const path = new URL(request.url).pathname.split('/')[2]

    return path
}

export default function AccountDetails(){

    const path = useLoaderData()

    const {docID, data} = useOutletContext()

    return (
        <>
            {docID === path ? 
            <div className="account__details">
                <p>Login: {`${data.l}`}</p>
                <p>Password: {`${data.k}`}</p>
            </div>
            : ''}
        </>
    )
}