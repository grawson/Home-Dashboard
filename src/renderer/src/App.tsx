import styled from 'styled-components'
import Calendar from './components/Calender'
import Holidays from './components/Holidays'
import ShabbatTimes from './components/ShabbatTimes'
import Weather from './components/Weather'
import { Background } from './components/Background'

const Container = styled.main`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`

const CalendarContainer = styled.div`
  display: flex;
  margin: 20px;
  flex: 1;
`

const Sidebar = styled.div`
  margin: 20px 20px 20px 0;
  display: flex;
  flex-direction: column;
  flex: 0 0 270px;
`

type SideCardContainerProps = {
  $shrink?: boolean
}

const SideCardContainer = styled.div<SideCardContainerProps>`
  display: flex;
  flex: 20% ${(props) => (props.$shrink ? 0 : 1)} ${(props) => (props.$shrink ? 1 : 0)};
  overflow: hidden;

  & + & {
    margin-top: 20px;
  }
`

const App = () => {
  return (
    <>
      <Background />
      <Container>
        <CalendarContainer>
          <Calendar />
        </CalendarContainer>

        <Sidebar>
          <SideCardContainer>
            <Weather />
          </SideCardContainer>

          <SideCardContainer>
            <Holidays />
          </SideCardContainer>

          <SideCardContainer $shrink>
            <ShabbatTimes />
          </SideCardContainer>
        </Sidebar>
      </Container>
    </>
  )
}

export default App
