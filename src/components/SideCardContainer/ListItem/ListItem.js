import React from 'react'
import '../../../globals.css'
import './ListItem.css'

export const ListItem = props => {
    return (
        <div className='flexRow'>
            <span>{props.name}</span>
            <span className='listDetails'>{props.details}</span>
        </div>

    )
}
