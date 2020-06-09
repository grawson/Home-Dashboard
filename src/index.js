import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { SideCardContainer } from './components/SideCardContainer/SideCardContainer'
import { CalendarContainer } from './components/CalendarContainer/CalendarContainer'
import './globals.css'

ReactDOM.render(
    <div id='appContainer' className='flexRow'>
        <CalendarContainer></CalendarContainer>
        <SideCardContainer></SideCardContainer>
    </div>,
    
  document.getElementById('main')
); 
