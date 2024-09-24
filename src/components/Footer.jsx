import React from 'react'

// for testing only
import { Link } from 'react-router-dom'

export default function Footer(){
    return (
    <footer className='footer'>
        &copy; FDN <Link to='/testing'>{':)'}</Link>
    </footer>
    )
}