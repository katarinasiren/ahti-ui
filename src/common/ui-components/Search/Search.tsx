import React, { useEffect, useRef, useState } from 'react';
import { IconSearch } from 'hds-react';
import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';

import styles from './Search.module.scss';
import {
  Feature,
  FeatureProperties,
} from '../../../domain/api/generated/types.d';
import CategoryIcon from '../CategoryIcon/CategoryIcon';
import escapeRegExp from './utils/escapeRegExp';
import MenuIcon from '../MenuIcon/MenuIcon';

const cx = classNames.bind(styles);

export interface SearchData {
  readonly id: string;
  readonly name: string;
  readonly location?: string;
  readonly category?: string;
}

interface SearchItemProps extends SearchData {
  readonly currentSearch: string;
  onSelect(id: string): void;
}

export const SearchItem: React.FC<SearchItemProps> = ({
  id,
  name,
  location,
  category,
  currentSearch,
  onSelect,
}) => {
  const { t } = useTranslation();
  const re = new RegExp(`(${escapeRegExp(currentSearch)})`, 'gi');
  const parts = name.split(re);

  return (
    <div
      className={styles.searchItem}
      onClick={() => onSelect(id)}
      role={'button'}
      aria-label={`${t('search.open')} ${name}`}
      tabIndex={0}
    >
      <div>
        <CategoryIcon className={styles.bigIcon} category={category} />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.name}>
          {parts.map((part: string, id: number) =>
            re.test(part) ? (
              <mark key={id} className={styles.nameMark}>
                {part}
              </mark>
            ) : (
              <span key={id}>{part}</span>
            )
          )}
        </div>
        <div className={styles.address}>{location}</div>
      </div>
    </div>
  );
};

interface SearchProps {
  readonly className?: string;
  readonly resultsClassName?: string;
  readonly maxItems?: number;
  readonly featuresToSearch: Feature[];
  onSelect(id: string): void;
  onClose(): void;
}

const Search: React.FC<SearchProps> = ({
  className,
  resultsClassName,
  featuresToSearch,
  maxItems = 10,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<SearchData[]>([]);
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (currentSearch === '') {
      setSearchResults([]);
      return;
    }
    const properties = featuresToSearch.reduce((acc: any, curr: any) => {
      if (curr.properties) {
        return [...acc, curr.properties];
      } else return acc;
    }, []);
    setSearchResults(
      properties
        .map((property: FeatureProperties) => {
          return {
            id: property.ahtiId,
            name: property.name,
            location: property.contactInfo?.address?.municipality,
            category: property.category?.id,
          };
        })
        .filter((searchResult: SearchData) =>
          searchResult.name.toLowerCase().includes(currentSearch.toLowerCase())
        )
        .slice(0, maxItems)
    );
  }, [currentSearch, featuresToSearch, maxItems]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className={cx(styles.container, className)} tabIndex={0}>
      <div className={styles.search}>
        <div className={styles.searchInputWithIcon}>
          <div>
            <IconSearch className={styles.bigIcon} />
          </div>
          <input
            type="text"
            value={currentSearch}
            className={styles.searchInput}
            onChange={(event) => setCurrentSearch(event.target.value)}
            aria-label={t('search.search')}
            placeholder={t('search.search')}
            ref={inputRef}
          />
        </div>
        <button
          className={styles.toggleMenuButton}
          onClick={onClose}
          tabIndex={0}
        >
          <MenuIcon isDark={true} isOpen={true} />
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className={styles.resultsContainer}>
          <div className={classNames(styles.resultsContent, resultsClassName)}>
            {searchResults.map((item: SearchData, id: number) => (
              <SearchItem
                key={id}
                {...item}
                currentSearch={currentSearch}
                onSelect={(id) => {
                  setCurrentSearch('');
                  onSelect(id);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
