import styled from 'styled-components';
import { Day as DayType } from '../../../types/calendar';

type ContainerType = {
	$isToday: boolean;
};

const Container = styled.div<ContainerType>`
	display: flex;
	border: #e9e9e9 solid 1px;
	margin: -1px 0 0 -1px;
	padding: 5px;
	background-color: ${props => props.$isToday && props.theme.palette.highlight};
`;

type OpaqueContainerProps = {
	$isOutOfMonth: boolean;
};

const OpaqueContainer = styled.div<OpaqueContainerProps>`
	opacity: ${props => props.$isOutOfMonth && 0.3};
`;

type DayNumberType = {
	$isOutOfMonth: boolean;
	$isToday: boolean;
};

const DayNumber = styled.span<DayNumberType>`
	font-size: 1.5rem;
	color: ${props =>
		props.$isOutOfMonth
			? props.theme.palette.lightgrey
			: props.$isToday
			  ? props.theme.palette.secondary
			  : props.theme.palette.primary};
`;

const Day = ({ date }: { date: DayType }) => {
	return (
		<Container $isToday={date.isToday}>
			<OpaqueContainer $isOutOfMonth={!date.isCurrentMonth}>
				<DayNumber $isOutOfMonth={!date.isCurrentMonth} $isToday={date.isToday}>
					{date.dayOfMonth}
				</DayNumber>
			</OpaqueContainer>
		</Container>
	);
};

export default Day;
