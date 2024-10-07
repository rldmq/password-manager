import React from 'react'
import { Outlet, Link, Form } from 'react-router-dom'
import { getFirestore, collection, doc, getDocs, getDoc, query, where, setDoc, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { app, auth, authRequired, autoLogout, generateId } from '../../assets/utils'

import ModalAddPassword from '../../components/ModalAddPassword'
import ModalEditDetails from '../../components/ModalEditDetails'

import { LuPlusCircle } from 'react-icons/lu'
// import { MdDeleteOutline } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'
import { MdVisibility } from 'react-icons/md'
import { MdVisibilityOff } from 'react-icons/md'
import { MdEdit } from 'react-icons/md'

export async function loader({ request }){
    await authRequired(request)
    return null
}

export async function action({ request }){
    const userID = auth.currentUser.uid

    const db = getFirestore(app)
    const dbRef = collection(db, userID)

    const formData = await request.formData()

    const purpose = formData.get('account-purpose')
    const login = formData.get('login')
    const password = formData.get('password')

    if(formData.get('edit') === 'on'){
        await updateDoc(doc(dbRef,formData.get('docID')),{
            f: purpose,
            k: password,
            l: login,
            dateModified: serverTimestamp(),
        })

    }else{
        await setDoc((doc(dbRef)),{
            f: purpose,
            id: generateId(),
            k: password,
            l: login,
            uid: userID,
            dateCreated: serverTimestamp(),
            dateModified: serverTimestamp(),
        })
    }


    return null
}

// need a greeting for user - means that on sign up, we have to take first name and update the user profile

export default function Account(){
    
    autoLogout()

    const [dataRender, setDataRender] = React.useState([])

    const [newAccountModalVis, setNewAccountModalVis] = React.useState(false)

    const [editModalVis, setEditModalVis] = React.useState(false)

    const [editItemDetails, seteditItemDetails] = React.useState(null)

    // come back to this at a later date : switching between show and hide text
    // const [showDetails, setShowDetails] = React.useState([])
    
    const db = getFirestore(app)
    const userID = auth.currentUser.uid
    const displayName = auth.currentUser.displayName?.split(' ')[0] || null

    const dbRef = collection(db, userID)

    const q = query(dbRef, where('uid', '==', userID))

    const currentHour = new Date().getHours()
    
    const greetingTime = currentHour < 12 && currentHour > 4 ? 'morning' 
    : currentHour >= 12 && currentHour < 18 ? 'afternoon' 
    : 'evening'

    React.useEffect(()=>{

        onSnapshot(collection(db,userID), (snapshot) => {
            setDataRender([])
            snapshot.forEach(doc =>{
                const dataRenderItem = 
                    <div className='account__item' id={doc.data().id} key={doc.data().id}>
                        <div>
                            <p>{doc.data().f}</p>

                            <Outlet context={{docID: doc.id,data: doc.data()}}/>
                        </div>
                        <div className='item__functions'>
                            <Link 
                                to={`${doc.id}`} 
                                onClick={()=>setActiveItem(doc.data().id)} id={`reveal-${doc.data().id}`}
                            >
                                <MdVisibility className='item__symbol item__symbol_show'/>
                            </Link>

                            <Link 
                                to={`.`} 
                                onClick={()=>removeActiveItem(doc.data().id)} 
                                id={`hide-${doc.data().id}`} 
                                style={{'display':'none'}}
                            >
                                <MdVisibilityOff className='item__symbol item__symbol_hide'/>
                            </Link>

                            <button className='item__btn item__btn_edit' onClick={()=> {
                                seteditItemDetails({
                                    id: doc.id,
                                    name: doc.data().f,
                                    login: doc.data().l,
                                    password: doc.data().k
                                })
                                setEditModalVis(true)
                            }}><MdEdit className='item__symbol item__symbol_edit'/></button>

                            <button onDoubleClick={()=>handleDeleteItem(doc.id)}className='item__btn item__btn_delete'>
                                <MdDeleteForever className='item__symbol item__symbol_delete'/>
                            </button>
                        </div>
                    </div>
        
                setDataRender(prev => [...prev, dataRenderItem ])
            })
        })
    },[])

    function setActiveItem(id){

        document.getElementById(id).classList.add('account__item_active')

        document.getElementById(`reveal-${id}`).style.display = 'none'
        document.getElementById(`hide-${id}`).style.display = 'block'

    }

    function removeActiveItem(id){
        document.getElementById(id).classList.remove('account__item_active')

        document.getElementById(`reveal-${id}`).style.display = 'block'
        document.getElementById(`hide-${id}`).style.display = 'none'
    }

    function handleSubmitAccountDetails(){
        // Delay to let action grab form data
        setTimeout(()=>{
            setNewAccountModalVis(false)
        }, 1)
    }

    async function handleDeleteItem(id){
        await deleteDoc(doc(db,userID, id))
    }

    function handleSubmitEdits(){
        // Delay to let action grab form data
        setTimeout(()=>{
            setEditModalVis(false)
        }, 1)
    }

    // function revealOrHideText(id){
    //     return document.getElementById(id)?.classList.includes('account__item_active') ? 'Hide' : 'Reveal'
    // }

    return(
        <main className='main main__account'>
            <p className='account__greeting'>{`Good ${greetingTime}${displayName ? `, ${displayName}!` : '!'}`}</p>
            <h1 className='account__heading'>Saved Passwords</h1>
            <div className='account__container_render'>
                <button className='account__addnew' onClick={()=>setNewAccountModalVis(true)}> <LuPlusCircle />Add A New Account</button>
                {dataRender}
            </div>

            {newAccountModalVis && <ModalAddPassword closeModal={()=>setNewAccountModalVis(false)} submitData={()=>handleSubmitAccountDetails()}/>}

            {editModalVis && <ModalEditDetails closeModal={()=>setEditModalVis(false)} submitData={()=>handleSubmitEdits(editItemDetails)} details={editItemDetails}/>}

        </main>
    )
}