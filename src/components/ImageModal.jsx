import React from 'react'

export default function ImageModal({ imgSrc, closeModal }){

    React.useEffect(()=>{
        document.addEventListener('mouseup', closeModal)

        return () => {
            document.removeEventListener('mouseup', closeModal)
        }
    },[])

    return(
        <div className='tickets__modal_background'>
            <img
            className='tickets__modal_img'
            src={imgSrc}
            alt='Ticket image attachment'
            />
        </div>
    )
}