import React from 'react'
import { useOutletContext, useLoaderData } from 'react-router-dom'

import { authRequired, autoLogout, showToast, decryptData } from '../../assets/utils'

import { FaRegCopy } from 'react-icons/fa'

export async function loader({ request }){

    await authRequired(request)

    const path = new URL(request.url).pathname.split('/')[2]

    return path
}

export default function AccountDetails(){

    autoLogout()

    const path = useLoaderData()

    const {docID, data, setToastList, theme} = useOutletContext()

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
    },[theme])

    return (
        <>
            {docID === path ? 
            <div className="account__details">
                <p className={`details__container ${theme === 'light' ? 'light' : ''}`}>Login:{displayMode === 'mobile' ? <br /> : ''}
                <button
                onClick={()=>showToast('Copied to clipboard!', 'success', setToastList,decryptData(data.l))}
                className={`details__l ${theme === 'light' ? 'light' : ''}`}
                style={displayMode === 'mobile' ? {marginLeft: '0', marginTop: '0.5em'} : null}
                >
                    {`${decryptData(data.l)}`} 
                    <FaRegCopy className={`details__symbol ${theme === 'light' ? 'light' : ''}`}/>
                    </button></p>
                <p className={`details__container ${theme === 'light' ? 'light' : ''}`}>Password:
                {displayMode === 'mobile' ? <br /> : ''}<button
                onClick={()=>showToast('Copied to clipboard!', 'success', setToastList,decryptData(data.k))}
                className={`details__k ${theme === 'light' ? 'light' : ''}`}
                style={displayMode === 'mobile' ? {marginLeft: '0', marginTop: '0.5em'} : null}
                >{`${decryptData(data.k)}`} <FaRegCopy className={`details__symbol ${theme === 'light' ? 'light' : ''}`}/></button></p>
            </div>
            : ''}
        </>
    )
}