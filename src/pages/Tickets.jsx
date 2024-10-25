import React from 'react'
import { useOutletContext } from 'react-router'
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'
import { app } from '../assets/utils'

import { HiSortAscending, HiSortDescending } from 'react-icons/hi'

import ImageModal from '../components/ImageModal'

export default function Tickets(){

    const theme = useOutletContext()

    const [ticketData, setTicketData] = React.useState([])

    const [sorting, setSorting] = React.useState('desc')

    const [filter, setFilter] = React.useState('')

    const [imageModalVis, setImageModalVis] = React.useState(false)

    const [imageModalSrc, setImageModalSrc] = React.useState('')
    
    const db = getFirestore(app)

    const filteredData = filter === 'feedback' ? ticketData.filter(e => e.topic === 'feedback')
    : filter === 'general-question' ? ticketData.filter(e => e.topic === 'general-question')
    : filter === 'tech-support' ? ticketData.filter(e => e.topic === 'tech-support')
    : filter === 'careers' ? ticketData.filter(e => e.topic === 'careers')
    : filter === 'other' ? ticketData.filter(e => e.topic === 'other')
    : ticketData

    const sortedData = sorting === 'asc' ? filteredData.sort((a,b) => a.dateCreated.seconds - b.dateCreated.seconds)
    : filteredData.sort((a,b) => b.dateCreated.seconds - a.dateCreated.seconds)

    const hrStyle = {
        backgroundColor: theme === 'dark' ? 'white' 
        : 'var(--light-mode-text)',
        display: 'block',
        height: '2px',
        border: 'none',
    }

    const msgStyle = {
        border: theme ==='dark' ? '1px solid white' : '1px solid var(--light-mode-text)'
    }

    const renderData = sortedData.map((e,index) => {

        const attachments = typeof e.files !== 'string' ? e.files.map((link, index) => {
            return <a
                    href={link}
                    key={index}
                    target='_blank'
                    className='item__link'
                    onClick={(e)=>handleOpenImageModal(e,link)}
                    >
                        <img
                        src={link}
                        className='item__img'
                        />
                    </a>
        }) : ''

        return(
            <div className='tickets__item' key={index}>
                <p className='item__name'>Name: {e.name}</p>
                <p className='item__email'>Email: {e.email}</p>
                <p className='item__date'>Date: {e.dateCreated.toDate().toString()}</p>
                <p className='item__topic'>Topic: {e.topic.replace('-', ' ')}</p>
                <div className='item__container_msg'>
                    <p>Message:</p>
                    <pre className='item__msg' style={msgStyle}>{e.message}</pre>
                </div>
                <div className='item__container_attachments'>
                    <p>Attachments: {!attachments && 'No Attachments'}</p>
                    {attachments &&
                    <div className='item__container_img'>
                        {attachments}
                    </div>}
                </div>
                {index !== sortedData.length-1 &&
                <hr style={hrStyle} className='item__hr'/>}
            </div>
        )
    })

    React.useEffect(()=>{
        if(theme === 'light'){
            document.querySelectorAll('*').forEach(e => e.classList.add('light'))
        }else{
            document.querySelectorAll('*').forEach(e => e.classList.remove('light'))
        }
    },[theme])

    React.useEffect(()=>{
        onSnapshot(collection(db,'contact'), (snapshot) =>{
            setTicketData([])
            snapshot.forEach(doc => {
                setTicketData(prev => [...prev, doc.data()])
            })
        })
    },[])

    function setActiveSortMethod(id){
        const asc = document.getElementById('tickets-sort-asc')
        const desc = document.getElementById('tickets-sort-desc')
        if(id === 'tickets-sort-asc'){
            asc.classList.add('active')
            desc.classList.remove('active')
        }
        if(id === 'tickets-sort-desc'){
            asc.classList.remove('active')
            desc.classList.add('active')
        }
    }

    function handleOpenImageModal(e,imgSrc){
        e.preventDefault()
        setImageModalVis(true)
        setImageModalSrc(imgSrc)
    }

    function handleCloseImageModal(e){
        if(e.target.classList.contains('tickets__modal_background')){
            setImageModalVis(false)
            setImageModalSrc('')
        }
    }

    return(
        <>
        <main className='main main__tickets'>
            <h1 className='tickets__heading'>Active Tickets</h1>
            {/* Filter */}
            <div className='tickets__container tickets__container_filter'>
                <label htmlFor='tickets-filter'>Filter Tickets:</label>
                <select
                defaultValue=''
                onChange={(e)=>setFilter(e.target.value)}
                className='tickets__filter'
                id='tickets-filter'
                >
                    <option value=''>
                        Show All
                    </option>
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
            </div>

            {/* Sort */}
            <div className='tickets__container tickets__container_sort'>
                <p>Sorted By Date:&nbsp;&nbsp;&nbsp;{sorting === 'desc' ? 'Descending' : 'Ascending'}</p>
                <button
                onClick={(e)=>{
                    setSorting('asc')
                    setActiveSortMethod('tickets-sort-asc')
                }}
                className='tickets__btn'
                id='tickets-sort-asc'
                >
                    <HiSortAscending className='tickets__btn_symbol'/>
                </button>
                <button
                onClick={(e)=>{
                    setSorting('desc')
                    setActiveSortMethod('tickets-sort-desc')
                }}
                className='tickets__btn active'
                id='tickets-sort-desc'
                >
                    <HiSortDescending className='tickets__btn_symbol'/>
                </button>
            </div>
            <hr
            className='tickets__hr'
            style={{...hrStyle, 
                backgroundColor: theme=== 'dark' ? 'var(--dark-mode-green)' 
                : 'var(--light-mode-green)'}}
            />
            <div className='tickets__container tickets__container_data'>
                {renderData.length ? renderData 
                : <p className='tickets__empty'>
                    No active tickets for this topic.
                </p>}
            </div>
        </main>
        {imageModalVis && <ImageModal imgSrc={imageModalSrc} closeModal={handleCloseImageModal}/>}
        </>
    )
}