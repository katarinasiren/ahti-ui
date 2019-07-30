import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BodyText from '../BodyText/BodyText';
import BaseButton from '../BaseButton/BaseButton';

import { ReactComponent as Exit } from '../../assets/icons/exit.svg';

import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
  opacity: 0;
  }
  to {
  opacity: 1;
  }
`;

const Container = styled.div`
  animation: ${fadeIn} 0.4s;
  z-index: 5000;
  position: absolute;

  height: 100vh;
  width: 100%;
`;

const Body = styled.div`
  background-color: ${props => props.theme.colors.white};
  position: absolute;
  height: 80vh;
  width: 100%;
  padding-top: 1rem;
  overflow: hidden;

  ${BodyText} {
    color: ${props => props.theme.colors.black};
  }
`;

const TextSection = styled.section`
  padding: 1.5rem 2rem;
`;

const ExitButton = styled(BaseButton)`
  z-index: 10000;
  top: 2rem;
  right: 2rem;
  position: absolute;
`;

const Line = styled.hr`
  margin: 0;
`;

const BackgroundShade = styled.div`
  position: absolute;
  top: 80vh;
  height: 20vh;
  width: 100%;
  z-index: 4999;
  background-color: rgb(0, 0, 0, 0.3);
`;

const LanguageButton = styled(BaseButton)`
  padding: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
`;

const Dropdown = ({ onExit }) => {
  const { t, i18n } = useTranslation();

  const onLanguageChange = () => {
    i18n.language === 'fi'
      ? i18n.changeLanguage('en')
      : i18n.changeLanguage('fi');
  };

  return (
    <Container>
      <ExitButton onClick={onExit}>
        <Exit />
      </ExitButton>
      <Body>
        <LanguageButton onClick={onLanguageChange}>
          {t('dropdown.change_language')}
        </LanguageButton>
        <TextSection>
          <Link to="/">
            <BodyText>{t('dropdown.add_location')}</BodyText>
          </Link>
          <Link to="/">
            <BodyText>{t('dropdown.give_feedback')}</BodyText>
          </Link>
        </TextSection>
        <Line />
        <TextSection>
          <Link to="/">
            <BodyText>{t('dropdown.about')}</BodyText>
          </Link>
        </TextSection>
      </Body>
      <BackgroundShade />
    </Container>
  );
};

export default Dropdown;