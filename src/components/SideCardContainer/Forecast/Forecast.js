import React from 'react'

export const Forecast = props => {
    return (
        <div className='flexCol'>
            <img className='forecast-icon' src={props.forecastIcon}></img>
            <div className='flexRow'>
                <p class="forecast-day">{props.forecastDay}</p>
                <p class="forecast-temp">{props.forecastTemp}</p>
            </div>
        </div>
    )
}