import React from 'react'
import { useParams, Link } from 'react-router-dom'

// For testing purposes
import data from '../assets/sample-data'

export default function TestingDetails(){

    const params = useParams()

    const [login, setLogin] = React.useState('')
    const [pass, setPass] = React.useState('')
    
    

    // We want the page to refresh when there is a new ID, hence params.id being included in the dependecy array
    React.useEffect(()=>{
        // fetch request here
        // maybe for now set up the accounts just as an example
        // placeholder instead of validation/fetch of user
        const user = data[0]
        const account = user.storage.filter((e) => e.account === params.id)[0]
        setLogin(account.login)
        setPass(account.pass)

        // user should not be in the params, since people can start just guessing
        console.log("i'm fetching data...")
    }, [params.id])

    return(
        <div className=''>
            <div>{login}</div>
            <div>{pass}</div>
            <Link to='..'>Hide</Link>
        </div>
    )
}