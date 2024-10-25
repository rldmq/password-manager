import React from 'react'
import { useRouteError, Link } from 'react-router-dom'

export default function Error(){

    const error = useRouteError()

    return(
        <main className='main main__error'>
            <h1>There was an error!</h1>
            <pre>Error: {error.message}</pre>
            <p>Please refresh the page and try again.</p>
            <p>If the issue persists, please <Link to='/contact'>Send us a message with details about the issue.</Link></p>
        </main>
    )
}