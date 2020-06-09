import React from 'react'
import '../../../globals.css'
import './SideCardHeader.css'


export const SideCardHeader = props => {
    return (
        <div className='card-header flexCol'>
            <span className='cardHeaderText'>{props.title}</span>
            <div className="card-separator"></div>
        </div>
    )
}