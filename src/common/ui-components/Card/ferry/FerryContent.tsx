import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { formatPrice, formatDuration } from '../../../utils/text';
import commonStyles from '../common/commonStyles.module.scss';

export interface FerryContentProps {
  readonly ferry: any;
}

const FerryContent: React.FC<FerryContentProps> = ({ ferry }) => {
  const { t } = useTranslation();

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.description}>
        {ferry.properties.description}
      </div>
      <div className={commonStyles.gridItem}>
        <div>{`${t('card.ferry_content.duration')}:`}</div>
        <div>{formatDuration(ferry.duration)}</div>
        <div>{`${t('card.ferry_content.pricing')}:`}</div>
        <div>{`${t('card.ferry_content.adultPricing')}: ${formatPrice(
          ferry.pricing.adult
        )}, ${t('card.ferry_content.childPricing')}: ${formatPrice(
          ferry.pricing.child
        )}`}</div>
      </div>
      <div className={commonStyles.gridItem}>
        <div>{`${t('card.ferry_content.startingPort')}:`}</div>
        <div>{`${ferry.portAddress.streetAddress}, ${ferry.portAddress.municipality}`}</div>
      </div>
      <div
        className={classNames(commonStyles.gridItem, commonStyles.urlContainer)}
      >
        <a className={commonStyles.url} href={ferry.bookingUrl}>{`${t(
          'card.ferry_content.booking'
        )}`}</a>
      </div>
    </div>
  );
};

export default FerryContent;
