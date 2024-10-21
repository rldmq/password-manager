import React from 'react'
import { Outlet, Link, useLoaderData, useActionData, useOutletContext, redirect } from 'react-router-dom'
import { getFirestore, collection, doc, setDoc, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { app, auth, authRequired, autoLogout, generateId, showToast } from '../../assets/utils'

import ModalAddPassword from '../../components/ModalAddPassword'
import ModalEditDetails from '../../components/ModalEditDetails'
import Toast from '../../toast/Toast'

import { LuPlusCircle } from 'react-icons/lu'
import { MdDeleteForever, MdVisibility, MdVisibilityOff, MdEdit } from 'react-icons/md'
import { IoMdSearch } from 'react-icons/io'
import { AiOutlineSortAscending, AiOutlineSortDescending } from 'react-icons/ai'

export async function loader({ request }){
    await authRequired(request)

    const path = new URL(request.url).pathname

    return path
}

export async function action({ request }){

    const userID = auth.currentUser.uid

    const db = getFirestore(app)
    // const dbRef = doc(db, 'userData', userID)

    const formData = await request.formData()

    const purpose = formData.get('account-purpose')
    const login = formData.get('login')
    const password = formData.get('password')

    const path = new URL(formData.get('url')).hash.slice(1)

    if(formData.get('edit') === 'on'){
        try{
            await updateDoc(doc(collection(db, 'userData', userID, 'saved'), formData.get('docID')),{
                f: purpose,
                k: password,
                l: login,
                dateModified: serverTimestamp(),
            })

            // return redirect(path)
            // return redirect(`${path}?u=${generateId()}`)
            return 'success-edit'
            // return await Promise.reject(new Error('fail'))
        }catch(err){
            console.log(err)
            return 'error'
        }
    }else{
        try{
            await setDoc(doc(collection(db, 'userData', userID, 'saved')),{
                f: purpose,
                id: generateId(),
                k: password,
                l: login,
                uid: userID,
                dateCreated: serverTimestamp(),
                dateModified: serverTimestamp(),
            })
            return 'success-add'
        }catch(err){
            console.log(err)
            return 'error'
        }

    }
}

export default function Account(){
    
    autoLogout()

    const theme = useOutletContext()

    const [searchTerm, setSearchTerm] = React.useState(null)

    const [toastList, setToastList] = React.useState([])

    const path = useLoaderData().split('/')[2]

    const action = useActionData()

    const [userData, setUserData] = React.useState([])

    const filteredData = searchTerm?.trim() ? userData.filter((e) => {
        return e.f.toLowerCase().includes(searchTerm.trim().toLowerCase())

        // Search all fields:
        // return e.f.includes(searchTerm) || e.k.includes(searchTerm) || e.l.includes(searchTerm)
    }) : userData

    const [sortBy, setSortBy] = React.useState('name')

    const [sortOrder, setSortOrder] = React.useState('asc')

    const sortedData = handleSortData()

    function handleSortData(){
        // Editing or adding a new item gives an error when it tries to sort, so try catch is used to handle the error
        try{
            return sortBy === 'name' && sortOrder === 'asc' ? filteredData.sort((a,b) => {
                if(a.f.toLowerCase() > b.f.toLowerCase()) return 1
                if(b.f.toLowerCase() > a.f.toLowerCase()) return -1
            })
            : sortBy === 'name' && sortOrder === 'desc' ? filteredData.sort((a,b) => {
                if(b.f.toLowerCase() > a.f.toLowerCase()) return 1
                if(a.f.toLowerCase() > b.f.toLowerCase()) return -1
                })
            : sortBy === 'date-created' && sortOrder === 'asc' ? filteredData.sort((a,b) => a.dateCreated.seconds - b.dateCreated.seconds)
            : sortBy === 'date-created' && sortOrder === 'desc' ? filteredData.sort((a,b) => b.dateCreated.seconds - a.dateCreated.seconds)
            : sortBy === 'date-modified' && sortOrder === 'asc' ? filteredData.sort((a,b) => a.dateModified.seconds - b.dateModified.seconds)
            : sortBy === 'date-modified' && sortOrder === 'desc' ? filteredData.sort((a,b) => b.dateModified.seconds - a.dateModified.seconds) : filteredData
        }catch(err){
            return filteredData
        }
    }

    const dataRender = sortedData?.map(item => {
        return (
            <div
            className='account__item'
            id={item.id}
            key={item.id}>
                <div>
                    <p>{item.f}</p>

                    <Outlet context={{docID: item.docID, data: item, setToastList: setToastList, theme: theme}}/>
                </div>
                <div className='item__functions'>
                    <Link 
                        to={`${item.docID}`} 
                        onClick={()=>setActiveItem(item.id)} id={`reveal-${item.id}`}
                        className='item__btn_reveal'
                        style={{'display': path === item.docID ? 'none' : 'block'}}
                    >
                        <MdVisibility className='item__symbol item__symbol_show'/>
                    </Link>

                    <Link 
                        to={`.`} 
                        onClick={()=>removeActiveItem(item.id)} 
                        id={`hide-${item.id}`} 
                        style={{'display': path === item.docID ? 'block' : 'none'}}
                        className='item__btn_hide'
                    >
                        <MdVisibilityOff className='item__symbol item__symbol_hide'/>
                    </Link>

                    <button className='item__btn item__btn_edit' onClick={()=> {
                        setEditItemDetails({
                            id: item.docID,
                            name: item.f,
                            login: item.l,
                            password: item.k
                        })
                        setEditModalVis(true)
                    }}><MdEdit className='item__symbol item__symbol_edit'/></button>

                    <button onDoubleClick={()=>handleDeleteItem(item.docID)}className='item__btn item__btn_delete'>
                        <MdDeleteForever className='item__symbol item__symbol_delete'/>
                    </button>
                </div>
            </div>
        )
    })

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
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    },[theme])

    React.useEffect(()=>{
        onSnapshot(collection(db, 'userData', userID, 'saved'), (snapshot) => {
            setUserData([])
            snapshot.forEach(doc =>{
                setUserData(prev => [...prev, {...doc.data(), docID : doc.id}])
            })
        })
    },[])

    // Remove active element when user clicks on 'Account' link
    React.useEffect(()=>{
        // Delay is needed for the browser to recognize updated path
        setTimeout(()=>{
            const hashLength = new URL(window.location.href).hash.split('/').length
            if(hashLength === 2){
                const items = document.querySelectorAll('.account__item')
                items.forEach(e => {
                        removeActiveItem(e.getAttribute('id'))
                })
            }
        }, 1)
    })

    React.useEffect(()=>{
        // if(action?.contains('u=')){
        //     showToast('Account updated!', 'success')
        // }
        // const actionUrl = window.location.href
        // console.log(actionUrl, "ran")
        if(action === 'success-edit'){
            showToast('Account updated!', 'success', setToastList)
        }
        if(action === 'success-add'){
            showToast('Account added!', 'success', setToastList)
        }
        if(action === 'error'){
            showToast('Error, please try again.', 'error', setToastList)
        }
    },[action])

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
        const activeEl = document.querySelector('.account__item_active')
        activeEl?.classList.remove('account__item_active')
        // Delay to let action grab form data
        setTimeout(()=>{
            setNewAccountModalVis(false)
            if(activeEl){
                removeActiveItem(activeEl.getAttribute('id'))
            }
        }, 1)
    }

    async function handleDeleteItem(id){
        try{
            await deleteDoc(doc(collection(db, 'userData', userID, 'saved'), id))
            showToast('Account deleted!', 'success', setToastList)
        }catch(err){
            console.log(err)
            showToast('Error, please try again.', 'error', setToastList)
        }
    }

    function handleSubmitEdits(){
        const activeEl = document.querySelector('.account__item_active')
        activeEl?.classList.remove('account__item_active')
        // Delay to let action grab form data
        setTimeout(()=>{
            setEditModalVis(false)
            if(activeEl){
                removeActiveItem(activeEl.getAttribute('id'))
            }
        }, 1)
    }

    function handleSearch(){
        const search = document.getElementById('search-data').value
        setSearchTerm(search)
    }

    function handleSortOrder(event,type){
        event.preventDefault()
        if(type === 'asc'){
            setSortOrder('asc')
            document.getElementById('sort-asc-btn').classList.add('active')
            document.getElementById('sort-desc-btn').classList.remove('active')
        }else if(type === 'desc'){
            setSortOrder('desc')
            document.getElementById('sort-desc-btn').classList.add('active')
            document.getElementById('sort-asc-btn').classList.remove('active')
        }
    }

    return(
        <main className='main main__account'>
            <p className='account__greeting'>{`Good ${greetingTime}${displayName ? `, ${displayName}!` : '!'}`}</p>
            <h1 className='account__heading'>Saved Passwords</h1>
            <div className='account__container_render'>
                <button className='account__addnew' onClick={()=>setNewAccountModalVis(true)}> <LuPlusCircle />Add A New Account</button>
                <div className='account__tools'>
                    <div className='account__search'>
                        <label htmlFor='search-data'>Search: </label>
                        <div className='account__search_container'>
                            <input
                            id='search-data'
                            name='search-data'
                            type='text'
                            placeholder='Type search term here...'
                            onChange={()=>handleSearch()} />
                            <button className='account__search_btn'>
                                <IoMdSearch />
                            </button>
                        </div>
                    </div>
                    <div className='account__sort'>
                        <label
                        htmlFor='sort-data'>Sort by: </label>
                        <select name='sort-data' id='sort-data' defaultValue='name'
                        onChange={(e)=>setSortBy(e.target.value)}>
                            <option value='date-created'>Date Created</option>
                            <option value='date-modified'>Date Modified</option>
                            <option value='name'>Name</option>
                        </select>
                        <button
                        id='sort-asc-btn' className='sort-btn active'
                        onClick={(e)=>handleSortOrder(e,'asc')}>
                            <AiOutlineSortAscending className='sort-btn-symbol'
                            />
                        </button>
                        <button
                        id='sort-desc-btn' className='sort-btn'
                        onClick={(e)=>handleSortOrder(e,'desc')}>
                            <AiOutlineSortDescending className='sort-btn-symbol'
                            />
                        </button>
                    </div>
                </div>
                {dataRender}
            </div>

            {newAccountModalVis && <ModalAddPassword closeModal={()=>setNewAccountModalVis(false)} submitData={()=>handleSubmitAccountDetails()} context={theme} userData={userData}/>}

            {editModalVis && <ModalEditDetails closeModal={()=>setEditModalVis(false)} submitData={()=>handleSubmitEdits(editItemDetails)} details={editItemDetails} context={theme} userData={userData}/>}
            <Toast toastList={toastList} context={theme}/>
        </main>
    )
}