import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'

export default function NotFound(){
    
    const theme = useOutletContext()

    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    })

    return (
        <main className='main main__notfound'>
            <h1>Sorry! The link you requested does not exist.</h1>
            <Link to='/'>Return to home page.</Link>
        </main>
    )
}