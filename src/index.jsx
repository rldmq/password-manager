import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles.css'
import './assets/styles/home.css'
import './assets/styles/about.css'
import './assets/styles/login.css'
import './assets/styles/signup.css'

import Layout from './components/Layout'
import Error from './components/Error'
import Home from './pages/Home'
import About from './pages/About'
import Login, { action as loginAction, loader as loginLoader } from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'

import Account, { loader as accountLoader } from './pages/account/Account'

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
                    <Route
                    path='account'
                    element={<Account />}
                    loader={accountLoader}
                    >
                    
                    </Route>
                    <Route path='testing' element={<Testing />} loader={testLoader}  errorElement={<Error />}>
                        {/* <Route index element={<ElementHere />} /> */}
                        <Route path=':id' element={<TestingDetails />}/>
                    </Route>
                    <Route path='*' element={<NotFound />} />
                </Route>
    ))

    return (
        <RouterProvider router={router} />
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)