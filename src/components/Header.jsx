import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
    return (
        <header>
            <img src="#" alt="Password Manager Logo"/>
            <nav>
                <ul>
                    <li><Link to='/about'>About</Link></li>
                    <li><Link to='/signup'>Sign up</Link></li>
                    <li><Link to='/login'>Login</Link></li>
                </ul>
            </nav>
        </header>
    )
}