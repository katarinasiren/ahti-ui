import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from 'react-router-dom';
import classNames from 'classnames';

import WrappedMenu from '../../common/ui-components/WrappedMenu/WrappedMenu';
import { useOvermind } from '../overmind';
import { boaterServicesSliderContent, categories } from '../constants';
import HeroBanner from '../../common/ui-components/HeroBanner/HeroBanner';
import ListView from '../../common/ui-components/ListView/ListView';
import CategoryNavigation from '../../common/ui-components/CategoryNavigation/CategoryNavigation';
import { Feature, useFeaturesQuery } from '../api/generated/types.d';
import styles from './IndexPage.module.scss';
import { useScrollToTop } from '../../common/utils/hooks';
import PromotionCard from '../../common/ui-components/PromotionCard/PromotionCard';
import { featuresLens } from '../../common/utils/lenses';
import Spinner from '../../common/ui-components/Spinner/Spinner';
import spinnerAnimation from '../../common/ui-components/Spinner/animations/spinner_rudder.json';
import videoUrl from '../../assets/videos/Ahti_vertical.mp4';
import ContentSlider from '../../common/ui-components/Slider/ContentSlider/ContentSlider';
import { Filter } from '../../../alltypes';

const IndexPage: React.FC = () => {
  const { actions } = useOvermind();
  const { data, refetch, loading } = useFeaturesQuery({
    variables: {
      first: 4,
      category: ['ahti:category:restaurant', 'ahti:category:cafe'],
    },
  });
  const { t, i18n } = useTranslation();
  const history = useHistory();
  useScrollToTop();

  useEffect(() => {
    refetch();
  }, [i18n.language]);

  const makeFilterFromId = (categoryId: string): Filter => {
    return {
      id: categoryId,
    };
  };

  return (
    <React.Fragment>
      <WrappedMenu menuDark={false}></WrappedMenu>
      <div className={classNames(styles.pageContainer)}>
        <HeroBanner videoUrl={videoUrl}>
          <h1>{t('index.main_header')}</h1>
          <Link className={styles.link} to={'/content'}>
            {t('index.see_all_button')}
          </Link>
        </HeroBanner>

        <section className={styles.section}>
          <h2>{t('index.section1_header')}</h2>
          <p>{t('index.section1_paragraph')}</p>
          <CategoryNavigation
            translated={true}
            categories={Object.values(categories).map(makeFilterFromId)}
            onClick={(categoryId: string) => {
              history.push('content');
              actions.addCategoryFilter(makeFilterFromId(categoryId));
            }}
          />
        </section>

        <section className={styles.section}>
          <h2>{t('index.section2_header')}</h2>
          <ContentSlider
            items={boaterServicesSliderContent}
            translated={true}
            slideClassName={styles.slide}
            onClick={(item) => {
              actions.setMapViewToggle(true);
              actions.setTagFilters(item.tagFilters);
              actions.setCategoryFilters(item.categoryFilters);
              history.push('content');
            }}
          />
        </section>

        <section className={styles.section}>
          <h2>{t('index.section3_header')}</h2>
          {loading && (
            <Spinner
              animation={spinnerAnimation}
              width={50}
              height={50}
              className={styles.listSpinner}
            />
          )}
          {!loading && data && (
            <ListView
              onClick={(feature: Feature) => {
                history.push('/content');
                actions.selectFeature(feature);
              }}
              features={featuresLens.get(data)}
            />
          )}
          <Link
            className={styles.link}
            to={'/content'}
            onClick={() => {
              actions.addCategoryFilter(
                makeFilterFromId('ahti:category:restaurant')
              );
            }}
          >
            {t('index.section3_button')}
          </Link>
        </section>

        <PromotionCard
          imageSrc={'/images/new_in_ahti.jpg'}
          header={t('index.section5_header')}
          text={t('index.section5_paragraph')}
          link={'/new'}
          linkText={t('index.section5_link')}
          className={styles.imageWithCardSection}
        />
      </div>
    </React.Fragment>
  );
};

export default IndexPage;
