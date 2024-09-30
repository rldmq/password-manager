import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
    return (
        <main className='main meain__notfound'>
            <h1>Sorry! The link you requested does not exist.</h1>
            <Link to='/'>Return to home page.</Link>
        </main>
    )
}