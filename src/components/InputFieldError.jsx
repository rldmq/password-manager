import React from 'react'

export default function InputFieldError({message, visibility}){
    const visible = {
        display: !visibility ? 'inline-block' : 'none'
    }
    return (
        <span style={visible} className='input-field-error'>*{message}</span>
    )
}