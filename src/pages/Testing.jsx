import React from 'react'
import { NavLink, Outlet, useSearchParams, useLoaderData, useRouteError } from 'react-router-dom'
// import api function for request for loader use

import data from '../assets/sample-data.js'
import { getData } from '../assets/api.js'

export function loader(){
    return "fetch request gets returned here"
}

export default function Testing(){

    // const loaderData = useLoaderData()

    const error = useRouteError()

    const [searchParams, setSearchParams] = useSearchParams()

    const tagFilter = searchParams.get('tag')

    const activeStyle = {
        backgroundColor : 'var(--dark-mode-green',
        // color : 'var(--dark-mode-green)',
        fontWeight : '600'
    }

    
    // when using data layer APIs we don't need the state anymore, it will be data = useLoaderData()
    const [userData, setUserData] = React.useState(null)

    React.useEffect(()=>{
        // Fetch goes here
        setUserData(data[0].storage)

        // async function getUserData(){
        //     const data = await getData()
        //     setUserData(data)
        // }

        // getUserData()

        //the dependency should be the user id and logged in state or something
    },[])

    // const filteredData = tagFilter ? userData.filter(e => e.tag.toLowerCase() === tagFilter) : userData

    // const dataRender = filteredData.map((e,i)=>{})

    const dataRender = userData ? userData.map((e,i) => {

        // use nested routing for the accounts
        return (
        <NavLink
        key={i}
        to={`./${e.account}`}
        className='test__account'
        style={({isActive})=>isActive?activeStyle:null}
        aria-label={`View account details for ${e.account}`}
        >
            <div>
                <p>{e.account}</p>
            </div>
        </NavLink>
        )
    }) : <h1>Loading...</h1>

    // data[0].storage.map((e) => console.log(e.account,e.login,e.pass))

    // throw new Error()

    return (
        <main className='main main__test'>
            {/* This should say something like "Welcome ${user}" */}
            <h1 className='test__heading'>Accounts</h1>
            <div>
                {/* render buttons here for tags */}
                {/* <button onClick={setSearchParams({type:"socials"})} /> */}
            </div>
            <div className='test__accounts'>
                {dataRender}
            </div>
            <div className='test__accountdetails'>
                <Outlet context={[userData, setUserData]}/>
            </div>
        </main>
    )
}