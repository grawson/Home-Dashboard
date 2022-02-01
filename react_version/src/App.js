import styled, { createGlobalStyle } from 'styled-components';
import Calendar from './Calender';
import Holidays from './Holidays';
import ShabbatTimes from './ShabbatTimes';
import Weather from './Weather';

const Container = styled.main`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`

export const Background = createGlobalStyle`
  body, html {
    height: 100vh;
    width: 100vw;
    background: #1e1d29;
    margin: 0;
    font-family: Lato;
    cursor: default;
    transition: background 0.4s linear;
    transition: color 0.4s linear;
    transition: fill 0.4s linear;
    overflow: hidden;
  }

  #root {
    height: 100%;
    width: 100%;
  }
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
  flex: 0 0 270px; /* do not grow, do not shrink, start at 250px */
`

const SideCardContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  
  & + & {
    margin-top: 20px
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

          <SideCardContainer>
            <ShabbatTimes />
          </SideCardContainer>
        </Sidebar>

      </Container>
    </>
  )
}

export default App;
