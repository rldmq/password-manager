import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'

import { TbLayoutSidebarLeftExpandFilled, TbLayoutSidebarRightExpandFilled } from 'react-icons/tb'
import { CgProfile } from 'react-icons/cg'
import { MdOutlinePassword } from 'react-icons/md'
import { GrContact } from 'react-icons/gr'

export default function Sidebar(){

    const theme = useOutletContext()

    const [sidebarState, setSidebarState] = React.useState('collapsed')

    const sidebarPosition = {
        left: sidebarState === 'collapsed' ? '-200px' : '0',
        transition: 'left 0.25s'
    }

    function handleSidebar(){
        if(sidebarState === 'collapsed'){
            setSidebarState('expanded')
        }
        if(sidebarState === 'expanded'){
            setSidebarState('collapsed')
        }
    }

    return (
        <div
        className='sidebar'
        style={sidebarPosition}
        >
            <Link to='profile' className='sidebar__link' onClick={()=>setSidebarState('collapsed')}><CgProfile className='link__symbol'/> Profile</Link>
            <Link to='/account' className='sidebar__link' onClick={()=>setSidebarState('collapsed')}><MdOutlinePassword className='link__symbol'/> Passwords</Link>
            <Link to='/contact' className='sidebar__link sidebar__link_contact'>Contact Us <GrContact className='link__symbol'/></Link>
            <button
            className={`sidebar__toggle`}
            onClick={()=> handleSidebar()}
            >
                {
                sidebarState === 'collapsed' ? 
                <TbLayoutSidebarLeftExpandFilled
                className={`sidebar__symbol ${theme === 'light' ? 'light' : ''}`}/> : 
                <TbLayoutSidebarRightExpandFilled
                className={`sidebar__symbol ${theme === 'light' ? 'light' : ''}`}/>
                }
            </button>
        </div>
    )
}