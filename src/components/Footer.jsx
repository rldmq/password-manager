import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){

    const currentYear = new Date(Date.now()).getFullYear()

    return (
    <footer className='footer'>
        &copy; FDN {currentYear}
        <Link to='/contact'>Contact Us</Link>
    </footer>
    )
}