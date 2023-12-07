import styled from 'styled-components'
import { useDailyWeather } from '../../../hooks/api/weather'
import WeatherLogos from '../../../images'

const Container = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(2, 1fr);
  height: 100%;
  row-gap: 8px;
  margin: 8px 0 16px 0;
  overflow: hidden;
`

const IconContainer = styled.div`
  display: flex;
  height: 24px;
  width: 24px;
`

const DayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const DayText = styled.span`
  font-size: 1.3rem;
  color: ${(props) => props.theme.palette.lightgrey};
`

const TempText = styled.span`
  font-size: 1.3rem;
`

const DailyWeather = () => {
  const [dailyWeather, isLoading, isError] = useDailyWeather()

  return (
    <Container>
      {isLoading ? (
        <span>Loading...</span>
      ) : isError ? (
        <span>There was an error</span>
      ) : (
        dailyWeather.map((dayForecast) => (
          <DayContainer key={dayForecast.day}>
            <IconContainer>
              <img src={WeatherLogos[dayForecast?.weatherCode]} />
            </IconContainer>

            <DayText>{dayForecast?.day}</DayText>
            <TempText>{dayForecast?.temp}°</TempText>
          </DayContainer>
        ))
      )}
    </Container>
  )
}

export default DailyWeather
