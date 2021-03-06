import React from 'react';
import classNames from 'classnames/bind';
import { Koros } from 'hds-react';

import { Video } from '../Video/Video';
import styles from './HeroBanner.module.scss';
import ImageWithCard from '../ImageWithCard/ImageWithCard';

const cx = classNames.bind(styles);

type HeroBannerProps = React.PropsWithChildren<{
  videoUrl?: string;
}>;

const HeroBanner: React.FC<HeroBannerProps> = ({ children, videoUrl }) => {
  return (
    <React.Fragment>
      <ImageWithCard
        src={'/images/landing.png'}
        className={classNames(styles.imageWithCard, styles.topImageWithCard)}
      >
        <section className={styles.imageWithCardSection}>
          {videoUrl && <Video videoUrl={videoUrl} />}
          <div className={cx(styles.container)}>{children}</div>
        </section>
      </ImageWithCard>

      <div className={styles.korosContainer}>
        <Koros className={styles.koros} />
      </div>
    </React.Fragment>
  );
};

export default HeroBanner;
