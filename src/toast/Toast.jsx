import React from 'react'
import { useOutletContext } from 'react-router-dom'

export default function Toast({ toastList }){

    const theme = useOutletContext()

    return (
        <div className='toast__container'>
            {toastList.map(e => (
                <div key={e.id} className={`toast toast__${e.type} ${theme === 'light' ? 'light' : ''}`}>
                    <p className={`${e.type}__body ${theme === 'light' ? 'light' : ''}`}>{e.body}</p>
                </div>
            ))}
        </div>
    )
}