import styled from 'styled-components';
import { useThisMonthsDates, useTodaysDateAndTime } from '../../hooks/dates';
import Card from '../Card';
import Day from './Day';
import { DOW } from '../../tools/dates';

const Container = styled.div`
	height: 100%;
	width: 100%;
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-template-rows: 25px repeat(5, 1fr);
`;

const DayOfWeek = styled.div`
	font-size: 1.4rem;
	text-align: center;
	color: ${props => props.theme.palette.primary};
	align-self: baseline;
`;

const Calendar = () => {
	const days = useThisMonthsDates();
	const dateHeader = useTodaysDateAndTime();

	return (
		<Card header={dateHeader} disableDivider>
			<Container>
				{DOW.map(dow => (
					<DayOfWeek key={dow}>{dow.charAt(0)}</DayOfWeek>
				))}

				{days.map(day => (
					<Day key={`${day.dayOfMonth}-${day.isCurrentMonth}`} date={day} />
				))}
			</Container>
		</Card>
	);
};

export default Calendar;
