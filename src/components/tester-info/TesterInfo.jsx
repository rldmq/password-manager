import React from 'react'
import { MdContentCopy } from 'react-icons/md'

import './tester-info.css'

export default function TesterInfo(){

    const [elementVisibility, setElementVisibility] = React.useState(false)

    const [spoilerVisibility, setSpoilerVisibility] = React.useState(true)

    const [copyEmail, setCopyEmail] = React.useState(false)

    const [copyPassword, setCopyPassword] = React.useState(false)

    const expandStyle = {
        right: elementVisibility ? '0px' : '-300px',
        boxShadow: elementVisibility ? '0 0 5px grey' : null,
    }

    const spoilerStytle = {
        opacity: spoilerVisibility ? '1' : '0',
        pointerEvents: spoilerVisibility ? 'auto' : 'none',
    }

    function handleExpand(e){
        e.preventDefault()
        setElementVisibility(prev => !prev)
    }

    function handleRevealSpoiler(){
        setSpoilerVisibility(prev => !prev)
    }

    function handleCopyCredentials(id){
        const copy = document.getElementById(id).innerText
        navigator.clipboard.writeText(copy)
        if(id === 'tester-email'){
            setCopyEmail(true)
            setTimeout(()=>{
                setCopyEmail(false)
            }, 500)
        }
        if(id === 'tester-password'){
            setCopyPassword(true)
            setTimeout(()=>{
                setCopyPassword(false)
            }, 500)
        }
    }

    return (
        <div className='tester' style={expandStyle}>
            <button
            className='tester__btn_wave'
            onClick={handleExpand}
            ><p>👋</p></button>
            <p>Hey there! If you'd like a shared test account to look around, info below:</p>
            <div>
                <p
                className='tester__spoiler'
                onClick={handleRevealSpoiler}
                style={spoilerStytle}
                >Reveal Credentials</p>
                <div>
                    <p
                    className='tester__container_email'
                    onClick={()=>handleCopyCredentials('tester-email')}
                    >Email: <span id='tester-email'>test@email.com</span> <MdContentCopy />{copyEmail && <span className='tester__copied'> copied!</span>}</p>
                    <p
                    className='tester__container_password'
                    onClick={()=>handleCopyCredentials('tester-password')}
                    >Password: <span id='tester-password'>Abc123</span> <MdContentCopy />{copyPassword && <span className='tester__copied'> copied!</span>}</p>
                </div>
            </div>
        </div>
    )
}