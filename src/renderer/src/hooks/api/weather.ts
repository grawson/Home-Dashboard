import { useEffect, useState } from 'react'
import { DOW } from '../../tools/dates'
import { DayOfWeek } from '../../types/dates'
import { HourForecast } from '../../types/weather'

const LOCATION = [40.93864, -73.80101]
const WEATHER_KEY = 'NzdhhtWnbp6AiHukCnl8pZwWsdAvkvlM'
const SHOULD_RUN = false
const WEATHER_CODES = {
  '0': 'Unknown',
  '1000': 'Clear, Sunny',
  '1100': 'Mostly Clear',
  '1101': 'Partly Cloudy',
  '1102': 'Mostly Cloudy',
  '1001': 'Cloudy',
  '2000': 'Fog',
  '2100': 'Light Fog',
  '4000': 'Drizzle',
  '4001': 'Rain',
  '4200': 'Light Rain',
  '4201': 'Heavy Rain',
  '5000': 'Snow',
  '5001': 'Flurries',
  '5100': 'Light Snow',
  '5101': 'Heavy Snow',
  '6000': 'Freezing Drizzle',
  '6001': 'Freezing Rain',
  '6200': 'Light Freezing Rain',
  '6201': 'Heavy Freezing Rain',
  '7000': 'Ice Pellets',
  '7101': 'Heavy Ice Pellets',
  '7102': 'Light Ice Pellets',
  '8000': 'Thunderstorm'
}

type DayForecast = {
  weatherCode: string
  day: DayOfWeek
  temp: number
}

export const useDailyWeather = (): [DayForecast[], boolean, boolean] => {
  const [dailyWeather, setDailyWeather] = useState<DayForecast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (SHOULD_RUN) {
      fetch(
        `https://api.tomorrow.io/v4/timelines?location=${LOCATION[0]}, ${LOCATION[1]}&fields=temperature&fields=weatherCode&units=imperial&timesteps=1d&apikey=${WEATHER_KEY}`
      )
        .then((response) => {
          return response.json()
        })
        .then(({ data }) => {
          const forecasts = data?.timelines?.[0]?.intervals

          if (forecasts) {
            const days: DayForecast[] = forecasts
              .slice(0, 6)
              .map(
                (day: {
                  values: { weatherCode: string; temperature: number }
                  startTime: string
                }) => ({
                  weatherCode: day.values.weatherCode,
                  day: DOW[new Date(day.startTime).getDay()],
                  temp: Math.round(day.values.temperature)
                })
              )

            setDailyWeather(days)
          } else {
            setDailyWeather([])
          }
        })
        .catch(() => {
          setIsError(true)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setDailyWeather([
        { weatherCode: '1000', day: 'Sunday', temp: 100 },
        { weatherCode: '1000', day: 'Monday', temp: 100 },
        { weatherCode: '1000', day: 'Tuesday', temp: 100 },
        { weatherCode: '1000', day: 'Wednesday', temp: 100 },
        { weatherCode: '1000', day: 'Thursday', temp: 100 },
        { weatherCode: '1000', day: 'Friday', temp: 100 }
      ])
      setIsLoading(false)
    }
  }, [])

  return [dailyWeather, isLoading, isError]
}

export const useHourlyWeather = (): [HourForecast[], boolean, boolean] => {
  const [hourlyWeather, setHourlyWeather] = useState<HourForecast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (SHOULD_RUN) {
      fetch(
        `https://api.tomorrow.io/v4/timelines?location=${LOCATION[0]}, ${LOCATION[1]}&fields=precipitationProbability&fields=temperature&fields=weatherCode&units=imperial&timesteps=1h&apikey=${WEATHER_KEY}`
      )
        .then((response) => {
          return response.json()
        })
        .then(({ data }) => {
          const forecasts = data?.timelines?.[0]?.intervals

          if (forecasts) {
            const hours: HourForecast[] = forecasts.slice(1, 7).map(
              (hour: {
                startTime: string
                values: {
                  temperature: number
                  precipitationProbability: number
                  weatherCode: string
                }
              }) => ({
                time: hour.startTime,
                weatherCode: hour.values.weatherCode,
                rainPercentage: hour.values.precipitationProbability,
                temp: Math.round(hour.values.temperature),
                description: WEATHER_CODES[hour.values.weatherCode]
              })
            )

            setHourlyWeather(hours)
          } else {
            setHourlyWeather([])
          }
        })
        .catch(() => {
          setIsError(true)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setHourlyWeather([
        {
          rainPercentage: 20,
          temp: 50,
          time: 'Sun Dec 03 2023 18:23:57',
          weatherCode: '1000',
          description: WEATHER_CODES[1000]
        },
        {
          rainPercentage: 20,
          temp: 50,
          time: 'Sun Dec 03 2023 19:23:57',
          weatherCode: '1000',
          description: WEATHER_CODES[1000]
        },
        {
          rainPercentage: 20,
          temp: 50,
          time: 'Sun Dec 03 2023 20:23:57',
          weatherCode: '1000',
          description: WEATHER_CODES[1000]
        },
        {
          rainPercentage: 20,
          temp: 50,
          time: 'Sun Dec 03 2023 21:23:57',
          weatherCode: '1000',
          description: WEATHER_CODES[1000]
        },
        {
          rainPercentage: 20,
          temp: 50,
          time: 'Sun Dec 03 2023 22:23:57',
          weatherCode: '1000',
          description: WEATHER_CODES[1000]
        },
        {
          rainPercentage: 20,
          temp: 50,
          time: 'Sun Dec 03 2023 23:23:57',
          weatherCode: '1000',
          description: WEATHER_CODES[1000]
        }
      ])
      setIsLoading(false)
    }
  }, [])

  return [hourlyWeather, isLoading, isError]
}
