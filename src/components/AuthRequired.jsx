import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

export default function AuthRequired(){
    // if not logged in
    if(!isLoggedIn){
        return <Navigate to='/login' /> 
    }
    return <Outlet />
}