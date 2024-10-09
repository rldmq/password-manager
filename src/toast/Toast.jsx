import React from 'react'

export default function Toast({ toastList }){

    return (
        <div className='toast__container'>
            {toastList.map(e => (
                <div key={e.id} className={`toast__${e.type}`}>
                    <p className={`${e.type}__body`}>{e.body}</p>
                </div>
            ))}
        </div>
    )
}