import React from 'react'
import '../assets/styles/secret-toggle-button.css'

import { BiShow, BiHide } from 'react-icons/bi'

export default function SecretToggleButton({ inputId }){

    const [symbol, setSymbol] = React.useState(<BiShow className='password__btn_symbol'/>)

    function handleShowSecret(inputId){
        setSymbol(<BiHide className='password__btn_symbol'/>)
        document.getElementById(inputId).setAttribute('type', 'text')
    }

    function handleHideSecret(inputId){
        setSymbol(<BiShow className='password__btn_symbol'/>)
        document.getElementById(inputId).setAttribute('type', 'password')
    }

    React.useEffect(()=>{
        const els = document.querySelectorAll('.password__btn_show')

        els.forEach(el => {
            const disableRightClick = el.addEventListener('contextmenu', (event) => event.preventDefault())
            
            // Not sure if this works as a cleanup function
            return () => els.forEach(el => {
                el.removeEventListener('contextmenu', disableRightClick)
            })
        })

    },[])


    return (
        <button
        className='password__btn_show'  
        onMouseDown={() => handleShowSecret(inputId)}
        onMouseUp={() => handleHideSecret(inputId)}
        onTouchStart={() => handleShowSecret(inputId)}
        onTouchEnd={() => handleHideSecret(inputId)}
        onClick={e => e.preventDefault()}
        type='button'
        >
            {symbol}
        </button>
    )
}