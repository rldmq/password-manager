import React from 'react'
import { useOutletContext, useLoaderData } from 'react-router-dom'

import { authRequired } from '../../assets/utils'

import { FaRegCopy } from 'react-icons/fa'

export async function loader({ request }){

    await authRequired(request)

    const path = new URL(request.url).pathname.split('/')[2]

    return path
}

export default function AccountDetails(){

    const path = useLoaderData()

    const {docID, data, showToast} = useOutletContext()

    return (
        <>
            {docID === path ? 
            <div className="account__details">
                <p className='details__container'>Login:<button
                onClick={()=>showToast('Copied to clipboard!', 'success', data.l)}
                className='details__l'
                >{`${data.l}`} <FaRegCopy className='details__symbol'/></button></p>
                <p className='details__container'>Password:<button
                onClick={()=>showToast('Copied to clipboard!', 'success', data.k)}
                className='details__k'
                >{`${data.k}`} <FaRegCopy className='details__symbol'/></button></p>
            </div>
            : ''}
        </>
    )
}