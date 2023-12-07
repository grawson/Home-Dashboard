import styled from 'styled-components';
import { HourForecast } from '../../../types/weather';

const Container = styled.div`
	display: flex;
	border-bottom: 1px solid ${props => props.theme.palette.separator};
	flex-grow: 1;
	justify-content: space-between;
	margin: 0 20px;
	padding: 8px;
	column-gap: 5px;
`;

const HourContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const TempText = styled.span`
	font-size: 1.2rem;
	text-wrap: nowrap;
`;

const HourText = styled(TempText)`
	color: ${props => props.theme.palette.lightgrey};
`;

const RainText = styled(TempText)`
	color: #494b86;
`;

type Props = {
	hourlyForecast: HourForecast[];
	isLoading: boolean;
	isError: boolean;
};

const HourlyWeather = ({ hourlyForecast, isLoading, isError }: Props) => {
	return (
		<Container>
			{isLoading ? (
				<span>Loading...</span>
			) : isError ? (
				<span>There was an error</span>
			) : (
				hourlyForecast?.map(hourForecast => (
					<HourContainer key={hourForecast?.time}>
						<HourText>
							{new Date(hourForecast?.time).toLocaleTimeString('en-us', {
								hour: 'numeric',
							})}
						</HourText>
						<TempText>{hourForecast?.temp}°</TempText>
						<RainText>{hourForecast?.rainPercentage}%</RainText>
					</HourContainer>
				))
			)}
		</Container>
	);
};

export default HourlyWeather;
