import React from 'react'
import { NavLink, redirect } from 'react-router-dom'

import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from '../assets/utils'

import collapsedMenuIcon from '../assets/images/icons8-menu-50.png'
import expandedMenuIcon from '../assets/images/icons8-collapse-24.png'

export default function Header(){

    const [mobileCollapsedMenu, setMobileCollapsedMenu] = React.useState(true)

    const [isLoggedIn, setIsLoggedIn] = React.useState(false)

    const [displayMode, setDisplayMode] = React.useState(window.innerWidth >= 540 ? 'desktop' : 'mobile')

    const activeStyle = {
        color : 'var(--dark-mode-green)',
        fontWeight : '600'
    }

    React.useEffect(()=>{
        onAuthStateChanged(auth, (user) =>{
            if(user){
                setIsLoggedIn(true)
            }else{
                setIsLoggedIn(false)
            }
        })
    },[])    

    window.addEventListener('resize', ()=>{
        if(window.innerWidth >= 540){
            setDisplayMode('desktop')
            setMobileCollapsedMenu(true)
        }else{
            setDisplayMode('mobile')
        }
    })

    function handleSignOut(){
        try{
            signOut(auth)
            return redirect('/')
        }catch(err){
            console.error(err)
        }
    }

    const expandedMenu = 
    (<nav
    className={`${displayMode === 'mobile' ? 'header__menu_mobile' : 'header__menu_desktop'}`}
    >
        <ul className={`${displayMode === 'mobile' ? 'header__menu_container_mobile' : 'header__menu_container_desktop'}`}>
            <li className='menu__item'>
                <NavLink to='/'
                onClick={()=>setMobileCollapsedMenu(true)}
                style={({isActive}) => isActive ? activeStyle : null}
                >
                    Home</NavLink>
            </li>
            <li className='menu__item'>
                <NavLink 
                to='/about'
                onClick={()=>setMobileCollapsedMenu(true)}
                style={({isActive}) => isActive ? activeStyle : null}
                >
                    About
                </NavLink>
            </li>
            {isLoggedIn? 
            <li className='menu__item'>
                <NavLink 
                to='/account' 
                onClick={()=>setMobileCollapsedMenu(true)}
                style={({isActive}) => isActive ? activeStyle : null}
                >
                    Account
                </NavLink>
            </li>
            : <li className='menu__item'>
                <NavLink 
                to='/login' 
                onClick={()=>setMobileCollapsedMenu(true)}
                style={({isActive}) => isActive ? activeStyle : null}
                >
                    Login
                </NavLink>
            </li>}
            {isLoggedIn ?  
            <li className='menu__item'>
                <NavLink 
                onClick={()=>{
                    setMobileCollapsedMenu(true)
                    handleSignOut()
                }}
                >
                    Sign out
                </NavLink>
            </li>
            : <li className='menu__item'>
                <NavLink 
                to='/signup' 
                onClick={()=>setMobileCollapsedMenu(true)}
                style={({isActive}) => isActive ? activeStyle : null}
                >
                    Sign up
                </NavLink>
            </li>}
        </ul>
    </nav>)

    return (
    <header className='header'>
        <div className='header__container'>
            {/* h1 to be converted to logo */}
            <h1 className='header__logo'>PM</h1>
            {
            displayMode === 'mobile' ? 
            <button 
            className='header__button'
            aria-label='Expand navigation menu.'>
                <img
                    src={mobileCollapsedMenu ? collapsedMenuIcon : expandedMenuIcon}
                    onClick={()=> setMobileCollapsedMenu(!mobileCollapsedMenu)}
                    alt='Mobile navigation menu button'
                    className='header__button_img'
                /> 
            </button> : expandedMenu
            }
        </div>
        {
        mobileCollapsedMenu ? <></> : expandedMenu
        }
    </header>
    )
}