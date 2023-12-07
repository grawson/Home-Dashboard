import styled from 'styled-components';
import Card from '../Card';
import { useParsha, useShabbatTimes } from '../../hooks/api/shabbat';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: space-between;
`;

const TimeRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin: 4px;

	&:first-child {
		margin-top: 0;
	}
`;

const Name = styled.span`
	font-size: 13px;
	margin-right: 16px;
`;

const Time = styled.span`
	font-size: 13px;
	color: #686868;
`;

const ShabbatTimes = () => {
	const [parsha, isParshaLoading, isParshaError] = useParsha();
	const [times, isTimesLoading, isTimesError] = useShabbatTimes();

	return (
		<Card
			header={isParshaError ? 'Error' : isParshaLoading ? 'Loading...' : parsha}
		>
			<Container>
				{isTimesError ? (
					<span>There was an issue getting the times</span>
				) : isTimesLoading ? (
					<span>Loading...</span>
				) : (
					<>
						<TimeRow>
							<Name>Candle Lighting</Name>
							<Time>{times?.candleLighting}</Time>
						</TimeRow>

						<TimeRow>
							<Name>Friday Mincha</Name>
							<Time>{times?.friMincha}</Time>
						</TimeRow>

						<TimeRow>
							<Name>Shabbat Mincha</Name>
							<Time>{times?.shabMincha}</Time>
						</TimeRow>

						<TimeRow>
							<Name>Havdala</Name>
							<Time>{times?.havdala}</Time>
						</TimeRow>
					</>
				)}
			</Container>
		</Card>
	);
};

export default ShabbatTimes;
