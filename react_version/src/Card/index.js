import styled from "styled-components";

const Container = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
`

const HeaderContainer = styled.div`
  display: flex;
  height: fit-content;
  padding: 10px;
  border-bottom: 1px solid #E9E9E9;
  margin: 0 20px;
`;

const HeaderText = styled.span`
  margin: 0 20px 0 20px;
  text-align: center;
  font-size: 18px;
  color: #FF8479;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  margin: 20px;
`

const Card = props => {
  const { header, children } = props;

  return (
    <Container>
      <HeaderContainer>
        <HeaderText>{header}</HeaderText>
      </HeaderContainer>

      <Content>
        {children}
      </Content>
    </Container>
  )
}

export default Card;