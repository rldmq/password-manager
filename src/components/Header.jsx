import React from 'react'
import { NavLink } from 'react-router-dom'

import collapsedMenuIcon from '../assets/images/icons8-menu-50.png'
import expandedMenuIcon from '../assets/images/icons8-collapse-24.png'

export default function Header(){

    const [mobileCollapsedMenu, setMobileCollapsedMenu] = React.useState(true)

    const [displayMode, setDisplayMode] = React.useState(window.innerWidth >= 540 ? 'desktop' : 'mobile')

    const activeStyle = {
        color : 'var(--dark-mode-green)',
        fontWeight : '600'
    }

    window.addEventListener('resize', ()=>{
        if(window.innerWidth >= 540){
            setDisplayMode('desktop')
            setMobileCollapsedMenu(true)
        }else{
            setDisplayMode('mobile')
        }
    })

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
            <li className='menu__item'>
                <NavLink 
                to='/login' 
                onClick={()=>setMobileCollapsedMenu(true)}
                style={({isActive}) => isActive ? activeStyle : null}
                >
                    Login
                </NavLink>
            </li>
            <li className='menu__item'>
                <NavLink 
                to='/signup' 
                onClick={()=>setMobileCollapsedMenu(true)}
                style={({isActive}) => isActive ? activeStyle : null}
                >
                    Sign up
                </NavLink>
            </li>
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