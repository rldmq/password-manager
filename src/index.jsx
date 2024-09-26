import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './styles.css'
import './assets/styles/home.css'
import './assets/styles/about.css'
import './assets/styles/login.css'
import './assets/styles/signup.css'

import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Test page
import Testing from './pages/Testing'
import TestingDetails from './pages/TestingDetails'
import './assets/styles/testing.css'

function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/' element={<Home />}/>
                    <Route path='about' element={<About />}/>
                    <Route path='login' element={<Login />}/>
                    <Route path='signup' element={<Signup />}/>
                    <Route path='testing' element={<Testing />}>
                        {/* <Route index element={<ElementHere />} /> */}
                        <Route path=':id' element={<TestingDetails />}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)