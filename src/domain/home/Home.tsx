import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import LinkBox from '../../Components/LinkBox/LinkBox';
import MapOverlay from '../../Components/MapOverlay/MapOverlay';
import Footer from '../footer/Footer';
import SecondaryTitle from '../../Components/SecondaryTitle/SecondaryTitle';
import Section from '../../Components/Section/Section';
import RoundBoxWithText from '../../Components/RoundBox/RoundBox';
import TertiaryTitle from '../../Components/TertiaryTitle/TertiaryTitle';
import UnstyledLink from '../../Components/UnstyledLink/UnstyledLink';
import VerticalBlock from '../../Components/VerticalBlock/VerticalBlock';
import BodyText from '../../Components/BodyText/BodyText';
import HelsinkiWave from '../../Components/HelsinkiWave/HelsinkiWave';
import { useQuery } from '@apollo/react-hooks';
import {
  PROMOTIONS,
  PROMOTIONS_features_edges_node_properties,
} from '../api/generatedTypes/PROMOTIONS';
import PROMOTIONS_QUERY from './queries/promotionsQuery';

const POINT_TYPES = ['myhelsinki'];

const removeTouchMoveEventFromWindow = (e: { stopPropagation: () => void }) => {
  e.stopPropagation();
};

const addTouchMoveEvenetListernerToWindow = () => {
  window.addEventListener('touchmove', removeTouchMoveEventFromWindow, {
    passive: false,
  });
};

const removeTouchMoveEvenetListernerToWindow = () => {
  window.removeEventListener('touchmove', removeTouchMoveEventFromWindow, {});
};

const filterSliderSettings = {
  centerMode: true,
  dots: false,
  swipeEvent: addTouchMoveEvenetListernerToWindow,
  afterChange: removeTouchMoveEvenetListernerToWindow,
  infinite: false,
  speed: 500,
  adaptiveWidth: true,
};

const pointPromotionSliderSettings = {
  dots: false,
  swipeEvent: addTouchMoveEvenetListernerToWindow,
  afterChange: removeTouchMoveEvenetListernerToWindow,
  infinite: true,
  centerMode: true,
  centerPadding: '60px',
  speed: 500,
  adaptiveHeight: true,
  adaptiveWidth: true,
};

const Home = ({
  promotion,
  promotions,
}: {
  promotion?: PROMOTIONS_features_edges_node_properties;
  promotions?: PROMOTIONS_features_edges_node_properties[];
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <MapOverlay>
        <SecondaryTitle> {t('home.main_header')}</SecondaryTitle>
        <LinkBox to="/map">{t('home.see_all_button')}</LinkBox>
      </MapOverlay>
      <HelsinkiWave />
      <Section>
        <SecondaryTitle>{t('home.section1_header')}</SecondaryTitle>
        <Slider {...filterSliderSettings}>
          {POINT_TYPES.map((type, id) => (
            <div key={id}>
              <RoundBoxWithText
                iconURL={`/icons/type/${type}.svg`}
                title={<TertiaryTitle> {t(`types.${type}`)} </TertiaryTitle>}
                pathToList={`/map?type=${type}` || '/map'}
              />
            </div>
          ))}
        </Slider>
      </Section>
      {promotion && (
        <React.Fragment>
          <Section widthShadow={true} images={promotion.images}>
            <SecondaryTitle>{promotion.name}</SecondaryTitle>
            <LinkBox variant="white" to={`/map?island=${promotion.name}`}>
              {t('home.section2_button')}
            </LinkBox>
          </Section>
          <HelsinkiWave />
        </React.Fragment>
      )}
      <Section>
        <SecondaryTitle>{t('home.section4_header')}</SecondaryTitle>
        <Slider {...pointPromotionSliderSettings}>
          {promotions &&
            promotions.map((point: any, id: number) => {
              return (
                <div key={id}>
                  <UnstyledLink
                    to={`/map?name=${point.name}` || '/map'}
                    key={id}
                  >
                    <VerticalBlock images={point.images}>
                      <SecondaryTitle>{point.name}</SecondaryTitle>
                    </VerticalBlock>
                  </UnstyledLink>
                </div>
              );
            })}
        </Slider>
      </Section>

      <Section
        widthShadow={true}
        images={[
          {
            url:
              'https://images.unsplash.com/photo-1507911618740-de629a41dd34?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
          },
        ]}
      >
        <SecondaryTitle>{t('home.section5_header')}</SecondaryTitle>
        <BodyText>{t('home.section5_subheader')}</BodyText>
        <LinkBox to="/map?type=visitor" variant="white">
          {t('home.section5_button')}
        </LinkBox>
      </Section>
      <Footer />
    </div>
  );
};

const HomeWrapper = () => {
  const { data } = useQuery<PROMOTIONS>(PROMOTIONS_QUERY);
  const [promotion, setPromotion] = useState<
    PROMOTIONS_features_edges_node_properties
  >();
  const [promotions, setPromotions] = useState<
    PROMOTIONS_features_edges_node_properties[]
  >();

  useEffect(() => {
    if (data && data.features && data.features.edges) {
      const promotionProperties = data.features.edges.reduce<
        PROMOTIONS_features_edges_node_properties[]
      >((acc, edge) => {
        if (edge && edge.node && edge.node.properties) {
          return [...acc, edge.node.properties];
        }
        return acc;
      }, []);
      setPromotions(promotionProperties);
      setPromotion(promotionProperties[0]);
    }
  }, [data]);

  return <Home promotion={promotion} promotions={promotions} />;
};

export { Home, HomeWrapper };
