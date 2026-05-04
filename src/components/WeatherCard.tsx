import { DOW } from '#/config'
import WeatherTestData from '#/test-data/weather'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import Card from './Card'

const REFRESH_RATE = 14400 // seconds

const LOCATION = [40.93864, -73.80101]

const WEATHER_CODES = {
  0: 'Unknown',
  1000: 'Clear, Sunny',
  1100: 'Mostly Clear',
  1101: 'Partly Cloudy',
  1102: 'Mostly Cloudy',
  1001: 'Cloudy',
  2000: 'Fog',
  2100: 'Light Fog',
  4000: 'Drizzle',
  4001: 'Rain',
  4200: 'Light Rain',
  4201: 'Heavy Rain',
  5000: 'Snow',
  5001: 'Flurries',
  5100: 'Light Snow',
  5101: 'Heavy Snow',
  6000: 'Freezing Drizzle',
  6001: 'Freezing Rain',
  6200: 'Light Freezing Rain',
  6201: 'Heavy Freezing Rain',
  7000: 'Ice Pellets',
  7101: 'Heavy Ice Pellets',
  7102: 'Light Ice Pellets',
  8000: 'Thunderstorm',
}

type WeatherResponse = {
  data: {
    timelines: {
      intervals: {
        startTime: string
        values: {
          weatherCode: keyof typeof WEATHER_CODES
          temperature: number
          precipitationProbability: number
        }
      }[]
    }[]
  }
}

const useHourlyWeather = () => {
  return useQuery({
    queryKey: ['hourly-weather'],
    refetchInterval: REFRESH_RATE * 1000,
    enabled: import.meta.env.VITE_DISABLE_APIS !== 'true',
    placeholderData:
      import.meta.env.VITE_DISABLE_APIS === 'true'
        ? WeatherTestData.hourly
        : undefined,
    queryFn: async () => {
      const url = `https://api.tomorrow.io/v4/timelines?location=${LOCATION[0]},${LOCATION[1]}&fields=precipitationProbability&fields=temperature&fields=weatherCode&units=imperial&timesteps=1h&apikey=${import.meta.env.VITE_WEATHER_API_KEY}`

      const { data } = await axios.get<WeatherResponse>(url)

      const forecasts = data?.data?.timelines?.[0]?.intervals

      if (forecasts) {
        const hours = forecasts.slice(1, 7).map((hour) => ({
          hour: format(parseISO(hour.startTime), 'h'),
          hourTemp: `${Math.round(hour.values.temperature)}°`,
          hourRainPerc: `${hour.values.precipitationProbability}%`,
        }))

        const currentWeatherCode = forecasts[0].values.weatherCode
        const currentWeatherText = WEATHER_CODES[currentWeatherCode]
        const currentTemp = forecasts[0].values.temperature
        const currentWeather = `${currentTemp}° ${currentWeatherText}`

        return {
          currentWeather,
          currentWeatherCode,
          hours,
        }
      } else {
        return {}
      }
    },
  })
}

const useDailyWeather = () => {
  return useQuery({
    queryKey: ['daily-weather'],
    refetchInterval: REFRESH_RATE * 1000,
    enabled: import.meta.env.VITE_DISABLE_APIS !== 'true',
    placeholderData:
      import.meta.env.VITE_DISABLE_APIS === 'true'
        ? WeatherTestData.daily
        : undefined,
    queryFn: async () => {
      const url = `https://api.tomorrow.io/v4/timelines?location=${LOCATION[0]},${LOCATION[1]}&fields=temperature&fields=weatherCode&units=imperial&timesteps=1d&apikey=${import.meta.env.VITE_WEATHER_API_KEY}`

      const { data } = await axios.get<WeatherResponse>(url)

      const forecasts = data?.data?.timelines?.[0]?.intervals

      if (forecasts) {
        const days = forecasts.slice(0, 6).map((day) => ({
          weatherCode: day.values.weatherCode,
          forecastDay: DOW[parseISO(day.startTime).getDay()],
          forecastTemp: `${Math.round(day.values.temperature)}°`,
        }))

        return days
      } else {
        return []
      }
    },
  })
}

export default function WeatherCard() {
  const { data: hourlyWeather, error: hourlyError } = useHourlyWeather()
  const { data: dailyWeather = [], error: dailyError } = useDailyWeather()

  return (
    <Card
      header={
        <div className="flex gap-2">
          <img src={`./assets/imgs/${hourlyWeather?.currentWeatherCode}.png`} />

          {hourlyWeather?.currentWeather}
        </div>
      }
      className="shrink-0"
    >
      <div className="border-border mx-5 flex justify-between border-b py-1">
        {hourlyError ? (
          <p className="flex h-full w-full items-center justify-center">
            {hourlyError.message}
          </p>
        ) : (
          (hourlyWeather?.hours || []).map((hour) => (
            <div key={hour.hour} className="flex flex-col text-center text-xs">
              <span className="text-grey-600 text-[10px]">{hour.hour}</span>
              <span>{hour.hourTemp}</span>
              <span className="text-blue-200">{hour.hourRainPerc}</span>
            </div>
          ))
        )}
      </div>

      {dailyError ? (
        <p className="flex h-full w-full items-center justify-center">
          {dailyError.message}
        </p>
      ) : (
        <div className="grid h-full grid-cols-2 grid-rows-3 place-items-center gap-y-2 overflow-hidden p-1">
          {dailyWeather.map((day) => (
            <div
              key={day.forecastDay}
              className="flex flex-col items-center text-center text-xs"
            >
              <img
                className="h-5 w-fit"
                src={`./assets/imgs/${day.weatherCode}.png`}
              />

              <p className="text-grey-600">{day.forecastDay}</p>
              <p>{day.forecastTemp}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
