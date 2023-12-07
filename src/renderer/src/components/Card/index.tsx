import { ReactNode } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	background-color: white;
	border-radius: 10px;
	box-shadow:
		0 10px 20px rgba(0, 0, 0, 0.19),
		0 6px 6px rgba(0, 0, 0, 0.23);
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
`;

type HeaderContainerProps = {
	$disableDivider: boolean;
};

const HeaderContainer = styled.div<HeaderContainerProps>`
	display: flex;
	height: fit-content;
	padding: 10px;
	border-bottom: ${props => !props.$disableDivider && '1px solid #e9e9e9'};
	margin: 0 20px;
	align-items: center;
	justify-content: center;
`;

const IconContainer = styled.div`
	display: flex;
	margin-right: 8px;
`;

const HeaderText = styled.span`
	font-size: 18px;
	color: ${props => props.theme.palette.secondary};
`;

type ContentProps = {
	$noMargin: boolean;
};

const Content = styled.div<ContentProps>`
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
	margin: ${props => !props.$noMargin && '20px'};
`;

type Props = {
	header: ReactNode;
	children: ReactNode;
	icon?: ReactNode;
	disableDivider?: boolean;
	noMargin?: boolean;
};

const Card = ({
	header,
	disableDivider = false,
	children,
	icon,
	noMargin = false,
}: Props) => {
	return (
		<Container>
			<HeaderContainer $disableDivider={disableDivider}>
				{icon && <IconContainer>{icon}</IconContainer>}
				<HeaderText>{header}</HeaderText>
			</HeaderContainer>

			<Content $noMargin={noMargin}>{children}</Content>
		</Container>
	);
};

export default Card;
