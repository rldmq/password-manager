import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Sidebar from './Sidebar.jsx'

import { auth } from '../assets/utils.js'

export default function Layout({ theme }){

    const location = useLocation()

    const [sidebarVis, setSidebarVis] = React.useState(false)

    React.useEffect(()=>{
        if(auth.currentUser){
            setSidebarVis(true)
        }else{
            setSidebarVis(false)
        }
    },[location])
    
    return(
        <>
            <Header theme={theme}/>
            <Outlet context={theme}/>
            <Footer theme={theme}/>
            {sidebarVis && <Sidebar />}
        </>
    )
}