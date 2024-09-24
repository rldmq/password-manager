import React from 'react'
import { Link, Outlet } from 'react-router-dom'

import data from '../assets/sample-data.js'

export default function Testing(){

    const dataRender = data[0].storage.map((e,i) => {

        // use nested routing for the accounts
        return (
        <Link
        key={i}
        to={`./${e.account}`}
        className='test__account'
        aria-label={`View account details for ${e.account}`}
        >
            <div>
                <p>{e.account}</p>
            </div>
        </Link>
        )
    })

    // data[0].storage.map((e) => console.log(e.account,e.login,e.pass))

    return (
        <main className='main main__test'>
            {/* This should say something like "Welcome ${user}" */}
            <h1 className='test__heading'>Accounts</h1>
            <div className='test__accounts'>
                {dataRender}
            </div>
            <div className='test__accountdetails'>
                <Outlet />
            </div>
        </main>
    )
}