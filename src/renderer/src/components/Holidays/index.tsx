import styled from 'styled-components';
import Card from '../Card';
import { useHolidays } from '../../hooks/api/holidays';

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
`;

const HolidayDate = styled.span`
	font-size: 13px;
	color: #686868;
`;

const Holidays = () => {
	const [holidays, isLoading, isError] = useHolidays();

	return (
		<Card header='Holidays'>
			{isError ? (
				<span>There was an error loading the holidays</span>
			) : isLoading ? (
				<span>Loading...</span>
			) : (
				holidays &&
				holidays.map(holiday => (
					<HolidayRow key={`${holiday.date}-${holiday.title}`}>
						<HolidayName>{holiday.title}</HolidayName>
						<HolidayDate>
							{new Date(holiday.date).getMonth() + 1}/
							{new Date(holiday.date).getDate()}
						</HolidayDate>
					</HolidayRow>
				))
			)}
		</Card>
	);
};

export default Holidays;
