import { useHourlyWeather } from '../../hooks/api/weather'
import Card from '../Card'
import DailyWeather from './DailyWeather'
import HourlyWeather from './HourlyWeather'
import WeatherImages from '../../images'

const Weather = () => {
  const [hourlyWeather, isHourlyWeatherLoading, isHourlyError] = useHourlyWeather()

  const todaysForecast = hourlyWeather?.[0]

  return (
    <Card
      header={hourlyWeather?.[0] ? `${todaysForecast?.temp}° ${todaysForecast?.description}` : null}
      icon={<img src={WeatherImages[todaysForecast?.weatherCode]} />}
      noMargin
    >
      <HourlyWeather
        hourlyForecast={hourlyWeather}
        isLoading={isHourlyWeatherLoading}
        isError={isHourlyError}
      />
      <DailyWeather />
    </Card>
  )
}

export default Weather
