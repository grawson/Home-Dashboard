import React from 'react'

export const Forecast = props => {
    return (
        <div className='flexCol'>
            <img className='forecast-icon' src={props.icon}></img>
            <div className='flexCol'>
                <span className="forecast-day">{props.day}</span>
                <span className="forecast-temp">{props.temp}</span>
            </div>
        </div>
    )
}