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

    return (
        <button
        className='password__btn_show'  
        onMouseDown={() => handleShowSecret(inputId)}
        onMouseUp={() => handleHideSecret(inputId)}
        onClick={e => e.preventDefault()}
        >
            {symbol}
        </button>
    )
}