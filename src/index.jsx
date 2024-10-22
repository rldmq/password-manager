import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, BrowserRouter, Routes, Route, createHashRouter } from 'react-router-dom'

import './styles.css'
import './assets/styles/home.css'
import './assets/styles/about.css'
import './assets/styles/login.css'
import './assets/styles/signup.css'
import './assets/styles/contact-us.css'
import './assets/styles/reset-password.css'
import './assets/styles/profile.css'
import './assets/styles/account/account.css'
import './assets/styles/account/modal-add-account.css'
import './toast/toast.css'

import Layout from './components/Layout'
import Error from './components/Error'
import Home from './pages/Home'
import About from './pages/About'
import Login, { action as loginAction, loader as loginLoader } from './pages/Login'
import Signup from './pages/Signup'
import ResetPassword, { action as resetPasswordAction } from './pages/ResetPassword'
import ContactUs, { action as contactUsAction } from './pages/ContactUs'
import NotFound from './pages/NotFound'
import Profile, { loader as profileLoader, action as profileAction } from './pages/Profile'

import Account, { loader as accountLoader, action as accountAction } from './pages/account/Account'
import AccountDetails, { loader as accountDetailsLoader } from './pages/account/AccountDetails'

import { MdDarkMode } from 'react-icons/md'
import { MdOutlineLightMode } from 'react-icons/md'

function App(){

    const [theme, setTheme] = React.useState('dark')

    const router = createHashRouter(createRoutesFromElements(
        <Route element={<Layout theme={theme}/>}>
                    <Route path='/' element={<Home />}/>
                    <Route path='about' element={<About />}/>
                    <Route
                    path='login'
                    element={<Login />}
                    action={loginAction}
                    loader={loginLoader}
                    />
                    <Route path='signup' element={<Signup />}/>
                    <Route path='recover' element={<ResetPassword />} action={resetPasswordAction}/>
                    <Route
                    path='account'
                    element={<Account />}
                    loader={accountLoader}
                    action={accountAction}
                    >
                        <Route path=':id'
                        element={<AccountDetails />}
                        loader={accountDetailsLoader}
                        />
                    </Route>
                    <Route
                    path='profile'
                    element={<Profile />}
                    loader={profileLoader}
                    action={profileAction}/>
                    <Route
                    path='contact'
                    element={<ContactUs />}
                    action={contactUsAction}/>

                    <Route path='*'
                    element={<NotFound />} />

                </Route>
    ))

    function handleThemeChange(){
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <>
            <RouterProvider router={router} />
            <button
            className='btn__theme'
            style={theme === 'light' ?
                {backgroundColor: 'var(--dark-mode-primary-background)'}
                : null}
            onClick={()=>handleThemeChange()}>
                {theme === 'dark' ? <MdOutlineLightMode className='btn__theme_text' /> : <MdDarkMode className='btn__theme_text' style={{fill: 'white'}}/>}
            </button>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)