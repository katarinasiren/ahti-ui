import styled from 'styled-components';

const VerticalBlock = styled.div`
  position: relative;
  background-color: ${props => props.theme.colors.white};

  background-image: url(${props => (props.withImage ? props.imageURL : null)});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  box-sizing: border-box;
  height: 28rem;
  width: 20rem;
  // hack for now
  width: 100%;
  margin-right: 1rem;

  color: ${props =>
    props.withImage ? props.theme.colors.white : props.theme.colors.black};

  padding: 4rem 2rem;
  box-shadow: inset 0px -28rem 28rem -28rem black;

  // TODO: refactor later!!!!!
  // flex most likely wont work on most mobile devices, refactor this later
  display: flex;
  justify-content: flex-end;
  flex-direction: column;

  h2 {
    display: inline;
    margin: 0;
    width: 100%;
    color: ${props =>
      props.withImage ? props.theme.colors.white : props.theme.colors.black};
  }
`;

export default VerticalBlock;