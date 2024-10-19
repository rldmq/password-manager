import React from 'react'
import { NavLink, redirect, Link, useNavigate } from 'react-router-dom'

import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from '../assets/utils'

import collapsedMenuIcon from '../assets/images/icons8-menu-50.png'
import expandedMenuIcon from '../assets/images/icons8-collapse-24.png'

import logoDarkHalf from '../assets/images/logo_dark_half_1.png'
import logoLightHalf from '../assets/images/logo_light_half_1.png'
import logoGreenHalf from '../assets/images/logo_half_2.png'

export default function Header({ theme }){

    const [mobileCollapsedMenu, setMobileCollapsedMenu] = React.useState(true)

    const [isLoggedIn, setIsLoggedIn] = React.useState(false)

    const [displayMode, setDisplayMode] = React.useState(window.innerWidth >= 540 ? 'desktop' : 'mobile')

    const [logoDisplay, setLogoDisplay] = React.useState(window.innerWidth >= 1000 ? 'large' : 'small')

    const activeStyle = {
        color : 'var(--dark-mode-green)',
        fontWeight : '600'
    }

    const navigate = useNavigate()

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

        if(window.innerWidth >= 1000){
            setLogoDisplay('large')
        }else{
            setLogoDisplay('small')
        }
    })

    function handleSignOut(){
        try{
            signOut(auth).then(()=>navigate('/login'))
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

    const expandedLogo = (
        <div className='logo__container_text'>
            <span className='logo__text logo__text_green'>password </span>
            <span className='logo__text'>manager</span>
        </div>
    )

    return (
    <header className='header' >
        <div className='header__container'>
            <Link to='/' className='header__logo_container'>
                <img src={theme === 'light' ? logoLightHalf : logoDarkHalf} alt='Password Manager Logo' className='header__logo_img' />
                {expandedLogo}
                <img src={logoGreenHalf} alt='Password Manager Logo' className='header__logo_img' />
            </Link>
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