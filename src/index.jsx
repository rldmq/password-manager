import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles.css'
import './assets/styles/home.css'
import './assets/styles/about.css'
import './assets/styles/login.css'
import './assets/styles/signup.css'
import './assets/styles/reset-password.css'
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
import NotFound from './pages/NotFound'

import Account, { loader as accountLoader, action as accountAction } from './pages/account/Account'
import AccountDetails, { loader as accountDetailsLoader } from './pages/account/AccountDetails'

// Test page
import Testing, { loader as testLoader } from './pages/Testing'
import TestingDetails from './pages/TestingDetails'
import './assets/styles/testing.css'

function App(){

    const router = createBrowserRouter(createRoutesFromElements(
        <Route element={<Layout />}>
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
                        <Route path=':id' element={<AccountDetails />} loader={accountDetailsLoader}/>
                    </Route>
                    <Route path='testing' element={<Testing />} loader={testLoader}  errorElement={<Error />}>
                        {/* <Route index element={<ElementHere />} /> */}
                        <Route index element={<TestingDetails />}/>
                    </Route>
                    <Route path='*' element={<NotFound />} />
                </Route>
    ))

    return (
        <RouterProvider router={router} />
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)