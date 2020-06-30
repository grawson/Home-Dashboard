const Mustache = require("mustache");
const Keys = require("../src/keys/keys");

const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const REFRESH_RATE = 2000;  // seconds

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
//
// const ICON_MAPPING = {
//     "clear-day": "clear-day"
//     "clear-night": "clear-night"
//     "rain": "",
//     "snow": "",
//     "wind": "",
//     "fog": "",
//     "cloudy": "",
//     "partly-cloudy-day": "",
//     "partly-cloudy-night": ""
// };


let weatherCodes = {
    freezing_rain_heavy: {
        title: "Freezing Rain",
        icon: './_assets/imgs/rain@2x.png'
    }, 
    freezing_rain: {
        title: "Freezing Rain",
        icon: './_assets/imgs/rain@2x.png'
    }, 
    freezing_rain_light: {
        title: "Freezing Rain",
        icon: './_assets/imgs/rain@2x.png'
    }, 
    freezing_drizzle: {
        title: "Freezing Rain",
        icon: './_assets/imgs/rain@2x.png'
    }, 
    ice_pellets_heavy: {
        title: "Hail",
        icon: './_assets/imgs/snow@2x.png'
    }, 
    ice_pellets: {
        title: "Hail",
        icon: './_assets/imgs/snow@2x.png'
    }, 
    ice_pellets_light: {
        title: "Hail",
        icon: './_assets/imgs/snow@2x.png'
    }, 
    snow_heavy: {
        title: "Heavy Snow",
        icon: './_assets/imgs/snow@2x.png'
    }, 
    snow: {
        title: "Snow",
        icon: './_assets/imgs/snow@2x.png'
    }, 
    snow_light: {
        title: "Light Snow",
        icon: './_assets/imgs/snow@2x.png'
    }, 
    flurries: {
        title: "Flurries",
        icon: './_assets/imgs/snow@2x.png'
    }, 
    tstorm: {
        title: "T-Storm",
        icon: './_assets/imgs/rain@2x.png'
    }, 
    rain_heavy: {
        title: "Heavy Rain",
        icon: './_assets/imgs/rain@2x.png'
    }, 
    rain: {
        title: "Rain",
        icon: './_assets/imgs/rain@2x.png'
    }, 
    rain_light: {
        title: "Light Rain",
        icon: './_assets/imgs/rain@2x.png'
    }, 
    drizzle: {
        title: "Drizzle",
        icon: './_assets/imgs/rain@2x.png'
    }, 
    fog_light: {
        title: "Light Fog",
        icon: './_assets/imgs/fog@2x.png'
    }, 
    fog: {
        title: "Fog",
        icon: './_assets/imgs/fog@2x.png'
    }, 
    cloudy: {
        title: "Cloudy",
        icon: './_assets/imgs/cloudy@2x.png'
    }, 
    mostly_cloudy: {
        title: "Mostly Cloudy",
        icon: './_assets/imgs/cloudy@2x.png'
    }, 
    partly_cloudy: {
        title: "Partly Cloudy",
        icon: './_assets/imgs/partly-cloudy-day@2x.png'
    }, 
    mostly_clear: {
        title: "Mostly Clear",
        icon: './_assets/imgs/clear-day@2x.png'
    }, 
    clear: {
        title: "Clear",
        icon: './_assets/imgs/clear-day@2x.png'
    }, 
}


async function getDailyWeather() {
    return fetch(`https://api.climacell.co/v3/weather/forecast/daily?apikey=${Keys.weatherKey}&lat=40.91149&lon=-73.78235&fields=temp,precipitation_probability,weather_code&unit_system=us`).then(response => response.json()).then(data => {
        let forecast = []

        for (let i = 1; i < 7; i++) {
            let today = data[i]
            forecast.push({
                forecastIcon: weatherCodes[today.weather_code.value].icon,
                forecastDay: (new Date(today.observation_time.value.replace(/-/gi, '/'))).toLocaleDateString('default', {'weekday': 'long'}),
                forecastTemp: `${Math.round(today.temp[1].max.value)}°/${Math.round(today.temp[0].min.value)}°`
            })
        }
        return forecast
    })
}

function getHourlyWeather() {
    return fetch(`https://api.climacell.co/v3/weather/forecast/hourly?apikey=${Keys.weatherKey}&lat=40.91149&lon=-73.78235&fields=temp,precipitation_probability,weather_code&unit_system=us&start_time=${(new Date()).toISOString()}`).then(response => response.json()).then(data => {
        let today = {}
        today.currentWeather = `${weatherCodes[data[0].weather_code.value].title} ${Math.round(data[0].temp.value)}`
        today.currentWeatherIcon = weatherCodes[data[0].weather_code.value].icon
        today.hours = []

        for (let i = 1; i < 7; i++) {
            let hour = data[i]
            today.hours.push({
                hour: new Date(hour.observation_time.value).toLocaleTimeString('en-us', {hour: '2-digit'}),
                hourTemp: `${Math.round(hour.temp.value)}°`,
                hourRainPerc: `${hour.precipitation_probability.value}%`
            })
        }

        return today
    })
}


async function loadWeather() {
    let promises = []


    promises.push(getDailyWeather())
    promises.push(getHourlyWeather())

    let values = await Promise.all(promises)

    $.get('./_view/weatherCard.mustache', template => {
        var rendered = Mustache.render(template, {
            forecast: values[0],
            currentWeather: `${values[1].currentWeather}°`,
            currentWeatherIcon: values[1].currentWeatherIcon,
            hours: values[1].hours
        });
        $('#weather-card').html(rendered);
    });
}




$(document).ready(function() {

    loadWeather();
    window.setInterval(function() {
        console.log("Reloading weather data...");
        loadWeather();
    }, REFRESH_RATE*1000);

});





