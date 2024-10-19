import React from 'react'
import { useOutletContext, Form, useNavigation, useActionData } from 'react-router-dom'

import { getApp } from 'firebase/app'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { getFirestore, doc, setDoc, collection, serverTimestamp } from 'firebase/firestore'

import { app, generateId } from '../assets/utils'

import { IoMdRemoveCircleOutline } from 'react-icons/io'

import Toast from '../toast/Toast'

let count = 0

export async function action({ request }){
    // For testing submitting state
    // await new Promise(r => setTimeout(r,2000))
    try{
        const formData = await request.formData()
    
        const name = formData.get('contact-name') || 'user'
        const email = formData.get('contact-email')
        const topic = formData.get('contact-topic')
        const message = formData.get('contact-message')

        const fileList = document.getElementById('contact-files').files

        // FIRESTORE
        const db = getFirestore(app)
        const contactRef = doc(collection(db, 'contact'))
        const newDocId = contactRef.id
        
        const imageURLs = []

        // STORAGE
        if(fileList.length){
            const storage = getStorage()
            for(let file of fileList){
                const contactImagesRef = ref(storage,`contact/${newDocId}/${file.name}`)
                try{
                    await uploadBytes(contactImagesRef, file)
                    
                    const imageURL = await getDownloadURL(contactImagesRef);

                    imageURLs.push(imageURL)

                }catch(err){
                    console.log(err)
                }
            }
        }

        await setDoc(contactRef, {
            name: name,
            email: email,
            topic: topic,
            message: message,
            files: imageURLs.length ? imageURLs : 'no-attachments',
            dateCreated: serverTimestamp(),
        })
        
        count++
        return `success ${count}`
    }catch(err){
        console.log(err)

        count++
        return `err ${count}`
    }
}

export default function ContactUs(){

    const theme = useOutletContext()

    const navigation = useNavigation()

    const action = useActionData()

    const [fileDisplay, setFileDisplay] = React.useState([])

    const [toastList, setToastList] = React.useState([])

    const namesList = ['Jack Bright', 'Charles Anborough', 'Django Bridge', 'Kain Crow']

    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach( e=> e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    }, [theme])

    // Set the placeholder email based on placeholder name
    React.useEffect(()=>{
        setTimeout(()=>{
            const emailName = document.getElementById('contact-name').getAttribute('placeholder').split(' ').map(e=> e.toLowerCase()).join('.')
            
            document.getElementById('contact-email').setAttribute('placeholder', `${emailName}@email.com`)
        },1)
    })

    React.useEffect(()=>{
        if(action?.includes('success')){
            document.getElementById('contact-name').value = ''
            document.getElementById('contact-email').value = ''
            document.getElementById('contact-message').value = ''
            document.getElementById('contact-files').value = ''

            // const clearFileListEl = document.getElementById('contact-files')
            // const emptyFiles = new DataTransfer()
            // clearFileListEl.files = emptyFiles.files

            setFileDisplay([])

            showToast('Message sent!', 'success')
        }
        if(action?.includes('error')){
            showToast('Error! Please refresh the page.', 'error')
        }
    },[action])
    
    function handleFileDrop(e){
        e.preventDefault()

        const fileInput = document.getElementById('contact-files')

        const newDataTransfer = new DataTransfer()

        // Move the files from the existing FileList into the new FileList
        for(let file of fileInput.files){
            newDataTransfer.items.add(file)
        }
        
        if(e.dataTransfer.items){
            [...e.dataTransfer.items].forEach((item) => {
                if(item.kind === 'file'){
                    const file = item.getAsFile()
                    let add = true
                    for(let item of fileInput.files){
                        if(item.name === file.name){
                            add = false
                            break
                        }
                    }
                    if(add){
                        newDataTransfer.items.add(file)
                    }
                }
            })
        }else{
            [...e.dataTransfer.files].forEach((file) => {
                let add = true
                for(let item of fileInput.files){
                    if(item.name === file.name){
                        add = false
                        break
                    }
                }
                if(add){
                    newDataTransfer.items.add(file)
                }
            })
        }

        fileInput.files = newDataTransfer.files

        handleFileDisplay()
        
        handleDragLeave(e)
    }

    function handleDragOver(e){
        e.preventDefault()
        if(e.target.getAttribute('id') === 'drop-zone'){
            e.target.style.backgroundColor = 'rgb(51, 100, 120)'
            e.target.style.border = '2px dashed rgb(97, 194, 232)'
            e.target.style.transition = '1s background-color, 1s border-color'

            document.querySelector('.drop__text').textContent = 'Release to upload files.'
        }
    }

    function handleDragLeave(e){
        e.preventDefault()
        if(e.target.getAttribute('id') === 'drop-zone'){
            e.target.style.backgroundColor = 'rgb(23,45,54)'
            e.target.style.border = '2px dashed rgb(48, 93, 111)'
            e.target.style.transition = '1s background-color, 1s border-color'

            document.querySelector('.drop__text').textContent = 'Upload files by dragging and dropping or use the button below to select the files manually.'
        }
    }

    function handleFileDisplay(){

        setFileDisplay([])

        const fileList = document.getElementById('contact-files').files

        // const fileDisplayEl = document.querySelector('.drop__files')

        for(let file of fileList){
            const itemId = generateId()

            const newItemDisplay = 
            <div className={`drop__item ${theme === 'light' ? 'light' : ''}`} key={itemId}>
                <p>{`${file.name}`}</p>
                <button
                onClick={(e)=>handleRemoveItem(e,file.name)}
                className='drop__item_btn'
                >
                    <IoMdRemoveCircleOutline className='drop__item_symbol'/>
                </button>
            </div>

            setFileDisplay(prev => [...prev, newItemDisplay])
        }
    }

    function handleRemoveItem(e,fileName){
        e.preventDefault()
        const fileListEl = document.getElementById('contact-files')
        const fileList = fileListEl.files

        const newDataTransfer = new DataTransfer()

        for(let file of fileList){
            if(fileName !== file.name){
                newDataTransfer.items.add(file)
            }
        }

        fileListEl.files = newDataTransfer.files

        handleFileDisplay()
    }

    function showToast(message, type){
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

    return (
        <main className='main main__contact'>
            <h1 className='contact__heading'>Contact Us</h1>
            <p className='contact__text'>Have any questions or concerns? Feel free to reach out and our team will get back to you within 24 hours!</p>
            <Form
            method='post'
            className='contact__form'>
                <label
                htmlFor='contact-name'
                className='contact__label contact__label_name'
                >
                    Your name:
                </label>
                <input
                type='text'
                id='contact-name'
                name='contact-name'
                placeholder={`${namesList[Math.floor(Math.random() * namesList.length)]}`}/>

                <label
                htmlFor='contact-email'
                className='contact__label contact__label_email'
                >
                    Your email:
                </label>
                <input
                type='email'
                id='contact-email'
                name='contact-email'
                placeholder='firstname.lastname@email.com'
                required/>

                <label
                htmlFor='contact-topic'
                className='contact__label contact__label_topic'
                >
                    Message topic:
                </label>
                <select
                id='contact-topic'
                name='contact-topic'
                defaultValue='tech-support'
                >
                    <option value='feedback'>
                        Feedback
                    </option>
                    <option value='general-question'>
                        General Question
                    </option>
                    <option
                    value='tech-support'>
                        Technical Support
                    </option>
                    <option value='careers'>
                        Career Opportunities
                    </option>
                    <option value='other'>
                        Other
                    </option>
                </select>

                <label
                htmlFor='contact-message'
                className='contact__label contact__label_message'
                >
                    Your message:
                </label>
                <textarea
                id='contact-message'
                name='contact-message'
                placeholder='Enter your message here.'
                required>
                </textarea>

                <label
                htmlFor='contact-files'
                className='contact__label contact__label_files'
                >
                    Upload files:
                </label>

                <div
                id='drop-zone'
                onDrop={(e)=>handleFileDrop(e)}
                onDragOver={(e)=> handleDragOver(e)}
                onDragLeave={(e)=>handleDragLeave(e)}
                >
                    {/* Drop your files here or select your files below: */}
                    <p className='drop__text'>Upload files by dragging and dropping or use the button below to select the files manually.
                    </p>
                    {/* Not sure if mobile has drag and drop */}
                    <input
                        type='file'
                        id='contact-files'
                        name='contact-files'
                        accept='image/png, image/jpeg'
                        onChange={()=>handleFileDisplay()}
                        multiple/>
                    <div className='drop__files' id='drop-files'>
                        {fileDisplay}
                    </div>
                </div>

                <button
                disabled={navigation.state === 'submitting'}
                className='contact__btn_submit'
                >
                    {navigation.state === 'idle' ? 'Send' : 'Sending...'}
                </button>
            </Form>
            <Toast toastList={toastList} context={theme}/>
        </main>
    )
}