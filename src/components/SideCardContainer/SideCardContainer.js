import React from 'react'
import { ListCard } from './ListCard/ListCard'
// import { ShabbatCard } from './ShabbatCard/ShabbatCard'
import { WeatherCard } from './WeatherCard/WeatherCard'
import Cheerio from 'cheerio'

export class SideCardContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            holidays: {
                items: [],
                isLoaded: false,
                error: null,
                title: 'Holidays'
            },
            shabbatTimes: {
                items: [],
                isLoaded: false,
                error: null,
                title: 'Shabbat'
            }
        }

        this.updateHolidays = this.updateHolidays.bind(this)
        this.updateShabbatTimes = this.updateShabbatTimes.bind(this)
        this.updateCurrWeather = this.updateCurrWeather.bind(this)
    }

    updateHolidays() {
        let holidays = []
        let today = new Date()

        fetch(`http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&ss=on&mf=on&c=off&s=off`).then(response => response.json()).then(data => {
            // only take 10 items
            data.items.forEach(holiday => {
                let date = new Date(holiday.date)
                if (date >= today && holidays.length < 10) {
                    holidays.push({
                        title: holiday.title,
                        details: `${date.getMonth() + 1}/${date.getDate()}`
                    })
                }
            })

            this.setState(prevState => ({
                ...prevState,
                holidays: {
                    ...prevState.holidays,
                    items: holidays,
                    isLoaded: true,
                },
            }))
        }, error => {
            this.setState(prevState => ({
                ...prevState,
                holidays: {
                    ...prevState.holidays,
                    error: error,
                    isLoaded: true
                },
            }))
        })
    }

    updateShabbatTimes() {
        let times = []

        // this weeks parsha
        fetch('https://www.hebcal.com/shabbat/?cfg=json&zip=10804&m=0').then(response => response.json()).then(parshaData => {
            var parsha = parshaData.items.find(e => e.category === 'parashat').title

            this.setState(prevState => ({
                ...prevState,
                shabbatTimes: {
                    ...prevState.shabbatTimes,
                    title: parsha
                }
            }))
        
        }, error => {
            this.setState(prevState => ({
                ...prevState,
                shabbatTimes: {
                    ...prevState.shabbatTimes,
                    error: error,
                    isLoaded: true
                }   
            }))
        })

        
        //times
        fetch('http://allow-any-origin.appspot.com/https://www.yinr.org/').then(response => response.text()).then(data => {
            let $ = Cheerio.load(data)
            let nodes = $('.two-fifth')[0].children[1].firstChild.firstChild
        
            // candle lighting

            let candle_lighting_node = $(nodes).find(':contains("Candle Lighting")')
            let timeRegex =  /\d{1,2}:\d*pm/

            try {   
                var cLTime = timeRegex.exec($(candle_lighting_node).text())[0]
                times.push({
                    title: 'Candle Lighting',
                    details: cLTime
                })
            }
            catch(err){}

            // Mincha
            let minchaNodes = $(nodes).find(":contains('Mincha')")
            try {
                var fridayMinchaTime = timeRegex.exec($(minchaNodes[0]).text())[0]
                times.push({
                    title: 'Friday Mincha',
                    details: fridayMinchaTime
                })
            }
            catch (err) {}
            try {
                var satMinchaTime = timeRegex.exec($(minchaNodes[2]).text())[0]   
                times.push({
                    title: 'Shabbat Mincha',
                    details: satMinchaTime
                })
            }
            catch (err) {}


            // Havdala
            try {
                let havdalNodes = $(nodes).find(":contains('Shabbat Ends')")
                var havdalaTime = timeRegex.exec($(havdalNodes).text())[0]
                times.push({
                    title: 'Havdala',
                    details: havdalaTime
                })
            }
            catch (err) {}

            this.setState(prevState => ({
                ...prevState,
                shabbatTimes: {
                    ...prevState.shabbatTimes,
                    items: times,
                    isLoaded: true,
                }
            }))
        
        }, error => {
            this.setState(prevState => ({
                ...prevState,
                shabbatTimes: {
                    ...prevState.shabbatTimes,
                    error: error,
                    isLoaded: true
                }   
            }))
        })
    }

    updateCurrWeather() {

    }

    render() {
        return (
            <div id='rightContainer'>
                <WeatherCard updateCurrWeather={this.updateCurrWeather}></WeatherCard>
                <ListCard updateData={this.updateHolidays} data={this.state.holidays}></ListCard>
                <ListCard updateData={this.updateShabbatTimes} data={this.state.shabbatTimes}></ListCard>
            </div>
        )
    }
}
