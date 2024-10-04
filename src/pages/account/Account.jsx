import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { getFirestore, collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore'
import { app, auth, authRequired, autoLogout } from '../../assets/utils'

export async function loader({ request }){
    await authRequired(request)
    return null
}

// need a greeting for user - means that on sign up, we have to take first name and update the user profile

export default function Account(){
    
    autoLogout()

    const [dataRender, setDataRender] = React.useState([])

    // come back to this at a later date : switching between show and hide text
    // const [showDetails, setShowDetails] = React.useState([])
    
    const db = getFirestore(app)
    const userID = auth.currentUser.uid
    const displayName = auth.currentUser.displayName.split(' ')[0] || null

    const dbRef = collection(db, userID)

    const q = query(dbRef, where("uid", "==", userID))

    const currentHour = new Date().getHours()
    
    const greetingTime = currentHour < 12 && currentHour > 4 ? 'morning' 
    : currentHour >= 12 && currentHour < 18 ? 'afternoon' 
    : 'evening'

    React.useEffect(()=>{
        getDocs(q).then(querySnapshot => querySnapshot.forEach((doc) => {
            // need to generate a key so react doesn't complain
            // this needs delete and edit buttons as well

            const dataRenderItem = 
                <div className='account__item' id={doc.data().f} key={doc.data().f}>
                    <p>{doc.data().f}</p>
                    <Link to={`${doc.id}`} onClick={()=>setActiveItem(doc.data().f)} id='reveal'>Reveal</Link>
                    <Link to={`.`} onClick={()=>removeActiveItem(doc.data().f)} id='hide' style={{"display":"none"}}>Hide</Link>
                    <Outlet context={{docID: doc.id,data: doc.data()}}/>
                </div>
    
            setDataRender(prev => [...prev, dataRenderItem ])
        }))
    },[])

    function setActiveItem(id){

        document.getElementById(id).classList.add('account__item_active')

        document.getElementById('reveal').style.display = "none"
        document.getElementById('hide').style.display = "block"

    }

    function removeActiveItem(id){
        document.getElementById(id).classList.remove('account__item_active')

        document.getElementById('reveal').style.display = "block"
        document.getElementById('hide').style.display = "none"
    }

    // function revealOrHideText(id){
    //     return document.getElementById(id)?.classList.includes('account__item_active') ? 'Hide' : 'Reveal'
    // }
    
    return(
        <main className='main main__account'>
            <h1 className='account__greeting'>{`Good ${greetingTime}${displayName ? `, ${displayName}!` : '!'}`}</h1>
            <h2 className=''>Saved Passwords:</h2>
            <div className='account__container_render'>
                {dataRender}
            </div>
        </main>
    )
}