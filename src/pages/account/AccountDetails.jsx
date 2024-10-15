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

    const {docID, data, showToast, theme} = useOutletContext()

    const [displayMode, setDisplayMode] = React.useState('mobile')

    React.useEffect(()=>{
        const windowEventListener = window.addEventListener('resize', ()=>{
            if(window.innerWidth >= 540){
                setDisplayMode('desktop')
            }else{
                setDisplayMode('mobile')
            }
        })

        return () => window.removeEventListener("resize",windowEventListener)
    },[])

    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    })

    return (
        <>
            {docID === path ? 
            <div className="account__details">
                <p className='details__container'>Login:{displayMode === 'mobile' ? <br /> : ''}<button
                onClick={()=>showToast('Copied to clipboard!', 'success', data.l)}
                className='details__l'
                style={displayMode === 'mobile' ? {marginLeft: '0', marginTop: '0.5em'} : null}
                >{`${data.l}`} <FaRegCopy className='details__symbol'/></button></p>
                <p className='details__container'>Password:
                {displayMode === 'mobile' ? <br /> : ''}<button
                onClick={()=>showToast('Copied to clipboard!', 'success', data.k)}
                className='details__k'
                style={displayMode === 'mobile' ? {marginLeft: '0', marginTop: '0.5em'} : null}
                >{`${data.k}`} <FaRegCopy className='details__symbol'/></button></p>
            </div>
            : ''}
        </>
    )
}