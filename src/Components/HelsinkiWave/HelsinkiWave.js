import wave from '../../assets/helsinki_wave.svg';

import styled from 'styled-components';

const HelsinkiWave = styled.div`
  position: relative;
  height: 30px;
  bottom: 30px;
  margin-bottom: -30px;
  z-index: 1400;

  background-image: url(${wave});
  background-repeat: repeat-x;
  background-size: 50px 100%;
`;

export default HelsinkiWave;