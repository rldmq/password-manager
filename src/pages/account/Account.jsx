import React from 'react'
import { Outlet, Link, useLoaderData, useActionData } from 'react-router-dom'
import { getFirestore, collection, doc, setDoc, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { app, auth, authRequired, autoLogout, generateId } from '../../assets/utils'

import ModalAddPassword from '../../components/ModalAddPassword'
import ModalEditDetails from '../../components/ModalEditDetails'
import Toast from '../../toast/Toast'

import { LuPlusCircle } from 'react-icons/lu'
import { MdDeleteForever } from 'react-icons/md'
import { MdVisibility } from 'react-icons/md'
import { MdVisibilityOff } from 'react-icons/md'
import { MdEdit } from 'react-icons/md'

export async function loader({ request }){
    await authRequired(request)

    const path = new URL(request.url).pathname

    return path
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
        try{
            await updateDoc(doc(dbRef,formData.get('docID')),{
                f: purpose,
                k: password,
                l: login,
                dateModified: serverTimestamp(),
            })
            return 'success'
            // return await Promise.reject(new Error('fail'))
        }catch(err){
            console.log(err)
            return 'error'
        }

    }else{
        try{
            await setDoc((doc(dbRef)),{
                f: purpose,
                id: generateId(),
                k: password,
                l: login,
                uid: userID,
                dateCreated: serverTimestamp(),
                dateModified: serverTimestamp(),
            })
            return 'success'
        }catch(err){
            console.log(err)
            return 'error'
        }

    }

    return null
}

export default function Account(){

    const [toastList, setToastList] = React.useState([])

    const path = useLoaderData().split('/')[2]

    const action = useActionData()
    
    autoLogout()

    const [dataRender, setDataRender] = React.useState([])

    const [newAccountModalVis, setNewAccountModalVis] = React.useState(false)

    const [editModalVis, setEditModalVis] = React.useState(false)

    const [editItemDetails, setEditItemDetails] = React.useState(null)
    
    const db = getFirestore(app)
    const userID = auth.currentUser.uid
    const displayName = auth.currentUser.displayName?.split(' ')[0] || null

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

                            <Outlet context={{docID: doc.id,data: doc.data(), showToast: showToast}}/>
                        </div>
                        <div className='item__functions'>
                            <Link 
                                to={`${doc.id}`} 
                                onClick={()=>setActiveItem(doc.data().id)} id={`reveal-${doc.data().id}`}
                                className='item__btn_reveal'
                                style={{'display': path === doc.id ? 'none' : 'block'}}
                            >
                                <MdVisibility className='item__symbol item__symbol_show'/>
                            </Link>

                            <Link 
                                to={`.`} 
                                onClick={()=>removeActiveItem(doc.data().id)} 
                                id={`hide-${doc.data().id}`} 
                                style={{'display': path === doc.id ? 'block' : 'none'}}
                                className='item__btn_hide'
                            >
                                <MdVisibilityOff className='item__symbol item__symbol_hide'/>
                            </Link>

                            <button className='item__btn item__btn_edit' onClick={()=> {
                                setEditItemDetails({
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

        const hideItemEls = document.querySelectorAll('.item__btn_hide')

        const revealItemEls = document.querySelectorAll('.item__btn_reveal')

        for(let item of hideItemEls){
            if(item.getAttribute('id') !== `hide-${id}`){
                item.style.display = 'none'
            }
        }

        for(let item of revealItemEls){
            if(item.getAttribute('id') !== `reveal-${id}`){
                item.style.display = 'block'
            }
        }

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
            if(action === 'success'){
                showToast('Account added!', 'success')
            }
            if(action === 'error'){
                showToast('Error, please try again.', 'error')
            }
        }, 1)
    }

    async function handleDeleteItem(id){
        try{
            await deleteDoc(doc(db,userID, id))
            showToast('Account deleted!', 'success')
        }catch(err){
            console.log(err)
            showToast('Error, please try again.', 'error')
        }
    }

    function handleSubmitEdits(){
        // Delay to let action grab form data
        console.log(action)
        setTimeout(()=>{
            setEditModalVis(false)
            if(action === 'success'){
                showToast('Account updated!', 'success')
            }
            if(action === 'error'){
                showToast('Error, please try again.', 'error')
            }
        }, 1)
    }

    function showToast(message, type, copyData){
        if(message.includes('clipboard')){
            navigator.clipboard.writeText(copyData)
        }
        const toastProperties = {
            id: Date.now(),
            body: message,
            type: type,
        }
        setToastList(prev => [...prev, toastProperties])
        setTimeout(()=>{
            setToastList(prev => {
                const list = [...prev]
                list.shift()
                return list
            })
        },2000)
    }

    return(
        <main className='main main__account'>
            <p className='account__greeting'>{`Good ${greetingTime}${displayName ? `, ${displayName}!` : '!'}`}</p>
            <h1 className='account__heading'>Saved Passwords</h1>
            <div className='account__container_render'>
                <button className='account__addnew' onClick={()=>setNewAccountModalVis(true)}> <LuPlusCircle />Add A New Account</button>
                {dataRender}
            </div>

            {newAccountModalVis && <ModalAddPassword closeModal={()=>setNewAccountModalVis(false)} submitData={()=>handleSubmitAccountDetails()} showToast={showToast}/>}

            {editModalVis && <ModalEditDetails closeModal={()=>setEditModalVis(false)} submitData={()=>handleSubmitEdits(editItemDetails)} details={editItemDetails} showToast={showToast}/>}
            <Toast toastList={toastList} />
        </main>
    )
}