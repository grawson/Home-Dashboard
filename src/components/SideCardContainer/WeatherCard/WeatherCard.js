import React from 'react'
import './WeatherCard.css'
import { SideCardHeader } from '../SideCardHeader/SideCardHeader'
import { Forecast } from '../Forecast/Forecast'


export class WeatherCard extends React.Component {
    componentDidMount() {
        this.props.updateCurrWeather()
        // update once a minute
        this.currWeatherInterval = setInterval(this.props.updateCurrWeather, (1000 * 60)) 
    }

    componentWillUnmount() {
        clearInterval(this.currWeatherInterval);
    }

    render() {
        return (
            <div className='card'>
                <SideCardHeader title={this.props.currWeather} />

                <div id='forecast-container'>
                     
                </div>
            </div>
        )
    }
}