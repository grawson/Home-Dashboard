import React from 'react'
import './WeatherCard.css'
import { SideCardHeader } from '../SideCardHeader/SideCardHeader'
import { Forecast } from '../Forecast/Forecast'


export class WeatherCard extends React.Component {
    componentDidMount() {
        this.props.updateCurrWeather()
        this.props.updateForecast()

        // update once every 30 minutes
        this.currWeatherInterval = setInterval(this.props.updateCurrWeather, (1000 * 60 * 30)) 
        // update once every 3 hours
        this.forecastInterval = setInterval(this.props.updateForecast, (1000 * 60 * 180)) 
    }

    componentWillUnmount() {
        clearInterval(this.currWeatherInterval);
        clearInterval(this.forecastInterval);
    }

    render() {
        let elems;
        let title = 'Weather'
        console.log(this.props.data)
        // check the title
        if (this.props.data.currWeather.error)
            title = <span>{this.props.data.currWeather.error.message}</span>
        else 
            title = this.props.data.currWeather.temp
        
        // check the forecast
        if (this.props.data.forecast.error)
            elems = <span>{this.props.data.currWeather.error.message}</span>   
        else if (!this.props.data.forecast.isLoaded)
            elems = <span>Loading...</span>
        else
            elems = this.props.data.forecast.days.map((e, idx) => <Forecast key={`forecast_${idx}`} icon={e.icon} day={e.day} temp={e.temp} ></Forecast>)

            
        return (
            <div className='card'>
                {/* <div className='flexRow'> */}
                    {/* <img src={this.props.data.currWeatherIcon} />  */}
                    <SideCardHeader title={title} />
                {/* </div> */}

                <div id='forecast-container'>
                    {elems}
                </div>
                
            </div>
        )
    }
}