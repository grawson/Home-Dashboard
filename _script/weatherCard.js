const Mustache = require("mustache");
const Keys = require("../src/keys/keys");

const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const REFRESH_RATE = 14400;  // seconds
const LOCATION = [40.938640, -73.801010]

const weatherCodes = {
  "0": "Unknown",
  "1000": "Clear, Sunny",
  "1100": "Mostly Clear",
  "1101": "Partly Cloudy",
  "1102": "Mostly Cloudy",
  "1001": "Cloudy",
  "2000": "Fog",
  "2100": "Light Fog",
  "4000": "Drizzle",
  "4001": "Rain",
  "4200": "Light Rain",
  "4201": "Heavy Rain",
  "5000": "Snow",
  "5001": "Flurries",
  "5100": "Light Snow",
  "5101": "Heavy Snow",
  "6000": "Freezing Drizzle",
  "6001": "Freezing Rain",
  "6200": "Light Freezing Rain",
  "6201": "Heavy Freezing Rain",
  "7000": "Ice Pellets",
  "7101": "Heavy Ice Pellets",
  "7102": "Light Ice Pellets",
  "8000": "Thunderstorm"
}

const getHourlyWeather = async () => {
  const { data } = await fetch(`https://api.tomorrow.io/v4/timelines?location=${LOCATION[0]}, ${LOCATION[1]}&fields=precipitationProbability&fields=temperature&fields=weatherCode&units=imperial&timesteps=1h&apikey=${Keys.weatherKey}`)
    .then(response => {
      return response.json();
    });
  const forecasts = data && data.timelines && data.timelines[0] && data.timelines[0].intervals;
  if (forecasts) {
    const hours = forecasts.slice(1, 7).map(hour => ({
      hour: new Date(hour.startTime).toLocaleTimeString('en-us', { hour: '2-digit' }),
      hourTemp: `${Math.round(hour.values.temperature)}°`,
      hourRainPerc: `${hour.values.precipitationProbability}%`
    }));

    const currentWeatherCode = forecasts[0].values.weatherCode;
    const currentWeatherText = weatherCodes[currentWeatherCode];
    const currentTemp = forecasts[0].values.temperature;
    const currentWeather = `${currentTemp}° ${currentWeatherText}`;

    return {
      currentWeather,
      currentWeatherCode,
      hours,
    };
  }
  else {
    return {};
  }
}

const getDailyWeather = async () => {
  const { data } = await fetch(`https://api.tomorrow.io/v4/timelines?location=${LOCATION[0]}, ${LOCATION[1]}&fields=temperature&fields=weatherCode&units=imperial&timesteps=1d&apikey=${Keys.weatherKey}`)
    .then(response => {
      return response.json()
    });
  const forecasts = data && data.timelines && data.timelines[0] && data.timelines[0].intervals;
  if (forecasts) {
    const days = forecasts.slice(0, 6).map(day => ({
      weatherCode: day.values.weatherCode,
      forecastDay: DOW[new Date(day.startTime).getDay()],
      forecastTemp: day.values.temperature
    }));

    return days;
  }
  else {
    return [];
  }
}

async function loadWeather() {
  const promises = []

  promises.push(getDailyWeather())
  promises.push(getHourlyWeather())

  const values = await Promise.all(promises)

  $.get('./_view/weatherCard.mustache', template => {
    var rendered = Mustache.render(template, {
      forecast: values[0],
      currentWeather: values[1].currentWeather,
      currentWeatherCode: values[1].currentWeatherCode,
      hours: values[1].hours
    });
    $('#weather-card').html(rendered);
  });
}

$(document).ready(function () {
  loadWeather();
  window.setInterval(function () {
    console.log("Reloading weather data...");
    loadWeather();
  }, REFRESH_RATE * 1000);
});





