import React from 'react'
import { useOutletContext } from 'react-router-dom'

export default function NotificationSlideUp({ type, message }){

    const style = {
        color: type.includes('success') ? "var(--dark-mode-green)" : 'red',
        borderColor: type.includes('success') ? "var(--dark-mode-green)" : 'red'
    }

    return (
        <div className='notification__slideup' style={style}>
            {message}
        </div>
    )
}