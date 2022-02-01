import { useEffect, useState } from "react";
import styled from "styled-components";
import { getHolidays } from "../api/api";
import Card from '../Card';

const HolidayRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 4px;

  &:first-child {
    margin-top: 0;
  }
`;

const HolidayName = styled.span`
  font-size: 13px;
  margin-right: 16px;
`

const HolidayDate = styled.span`
  font-size: 13px;
  color: #686868;
`

const Holidays = props => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    getHolidays()
      .then(newHolidays => {
        setHolidays(newHolidays?.items || []);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <Card
      header='Holidays'
    >
      {holidays && holidays.map(holiday => 
        <HolidayRow key={`${holiday.date}-${holiday.title}`}>
          <HolidayName>{holiday.title}</HolidayName>
          <HolidayDate>{new Date(holiday.date).getMonth() + 1}/{new Date(holiday.date).getDate()}</HolidayDate>
        </HolidayRow>
      )}
    </Card>
  )
}

export default Holidays;