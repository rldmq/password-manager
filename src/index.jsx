import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import collapsedMenuIcon from './assets/images/icons8-menu-50.png'
import expandedMenuIcon from './assets/images/icons8-collapse-24.png'
import './styles.css'
import './assets/styles/home.css'

import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App(){

    const [mobileCollapsedMenu, setMobileCollapsedMenu] = React.useState(true)

    const [displayMode, setDisplayMode] = React.useState(window.innerWidth >= 540 ? 'desktop' : 'mobile')

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
            <li className='menu_item'>
                <Link to='/' onClick={()=>setMobileCollapsedMenu(true)}>Home</Link>
            </li>
            <li className='menu_item'>
                <Link 
                to='/about'
                onClick={()=>setMobileCollapsedMenu(true)}>
                    About
                </Link>
            </li>
            <li className='menu_item'>
                <Link 
                to='/login' 
                onClick={()=>setMobileCollapsedMenu(true)}>
                    Log in
                </Link>
            </li>
            <li className='menu_item'>
                <Link 
                to='/signup' 
                onClick={()=>setMobileCollapsedMenu(true)}>
                    Sign up
                </Link>
            </li>
        </ul>
    </nav>)
    

    return (
        <BrowserRouter>
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
                
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/about' element={<About />}/>
                <Route path='/login' element={<Login />}/>
                <Route path='/signup' element={<Signup />}/>
            </Routes>

            <footer className="footer">
                &copy; FDN
            </footer>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

// fetch(api).then(res => res.json()).then(data => console.log(data))