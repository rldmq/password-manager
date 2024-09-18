import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './styles.css'

import Home from './pages/Home'
import About from './pages/About'

function App(){
    return (
        <BrowserRouter>
        <nav>
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
        </nav>
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/about' element={<About />}/>
                <Route path='/account' element={<About />}/>
                <Route path='/account/:id' element={<About />}/>
            </Routes>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

// fetch(api).then(res => res.json()).then(data => console.log(data))