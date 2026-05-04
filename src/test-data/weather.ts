export default {
  daily:
    [
      { weatherCode: 1000 as const, forecastDay: 'Tuesday', forecastTemp: '80°' },
      { weatherCode: 1001 as const, forecastDay: 'Wednesday', forecastTemp: '65°' },
      { weatherCode: 1001 as const, forecastDay: 'Thursday', forecastTemp: '60°' },
      { weatherCode: 1001 as const, forecastDay: 'Friday', forecastTemp: '44°' },
      { weatherCode: 1000 as const, forecastDay: 'Saturday', forecastTemp: '46°' },
      { weatherCode: 1001 as const, forecastDay: 'Sunday', forecastTemp: '49°' }
    ],
  hourly: {
    currentWeather: '52.2° Clear, Sunny',
    currentWeatherCode: 1000 as const,
    hours: [
      { hour: '11 AM', hourTemp: '49°', hourRainPerc: '0%' },
      { hour: '12 PM', hourTemp: '46°', hourRainPerc: '0%' },
      { hour: '01 PM', hourTemp: '46°', hourRainPerc: '0%' },
      { hour: '02 PM', hourTemp: '48°', hourRainPerc: '0%' },
      { hour: '03 PM', hourTemp: '48°', hourRainPerc: '0%' },
      { hour: '04 PM', hourTemp: '49°', hourRainPerc: '0%' }
    ]
  }
}