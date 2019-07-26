import React, { memo } from 'react';
import { LazyImage } from 'react-lazy-images';
import SecondaryTitle from '../SecondaryTitle/SecondaryTitle';
import BackButton from '../BackButton/BackButton';
import BodyText from '../BodyText/BodyText';
import CardImageContainer from '../CardImageContainer/CardImageContainer';
import CardTextContainer from '../CardTextContainer/CardTextContainer';
import HelsinkiWave from '../HelsinkiWave/HelsinkiWave';
import { ReactComponent as HomeIcon } from '../../assets/icons/home.svg';
import { ReactComponent as PhoneIcon } from '../../assets/icons/phone.svg';

import styled from 'styled-components';

const Container = styled.div`
  z-index: 1399;
  box-sizing: border-box;
  height: 60vh;
  top: 40vh;
  position: absolute;
  width: 100%;
  background-color: ${props => props.theme.colors.white};
`;

const Home = styled(HomeIcon)`
  margin-right: 1rem;
`;

const Phone = styled(PhoneIcon)`
  margin-right: 1rem;
`;

const PhoneContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Line = styled.hr`
  margin: 1rem 0;
  border-color: ${props => props.theme.colors.black};
`;

const MapCard = ({ pointData, onBack }) => {
  const website =
    (pointData && pointData.properties.website) || '<placeholder site>';
  const phone =
    (pointData && pointData.properties.phone_number) || '<placeholder #>';
  const imageURL = `/images/${pointData.properties.imageId}.jpeg`;
  return (
    (pointData && (
      <React.Fragment>
        <BackButton onBack={onBack} />
        <Container>
          <LazyImage
            src={imageURL}
            placeholder={({ ref }) => (
              <CardImageContainer ref={ref}>
                {pointData.properties.fi.name && (
                  <SecondaryTitle>
                    {pointData.properties.fi.name}
                  </SecondaryTitle>
                )}
                {pointData.properties.fi.header && (
                  <div>
                    <BodyText>{pointData.properties.fi.header}</BodyText>
                  </div>
                )}
              </CardImageContainer>
            )}
            actual={() => (
              <CardImageContainer imageURL={imageURL}>
                {pointData.properties.fi.name && (
                  <SecondaryTitle>
                    {pointData.properties.fi.name}
                  </SecondaryTitle>
                )}
                {pointData.properties.fi.header && (
                  <div>
                    <BodyText>{pointData.properties.fi.header}</BodyText>
                  </div>
                )}
              </CardImageContainer>
            )}
          />

          <HelsinkiWave />
          <CardTextContainer>
            <a href={website}>
              <Home height="24" viewBox="0 0 48 48" />
              <BodyText>{website}</BodyText>
            </a>

            <Line />
            <PhoneContainer>
              <Phone height="24" viewBox="0 0 48 48" />
              <BodyText>{phone}</BodyText>
            </PhoneContainer>
          </CardTextContainer>
        </Container>
      </React.Fragment>
    )) ||
    ''
  );
};

// TODO: get rid of react memeo as soon as we optimize the map page component
export default memo(MapCard);