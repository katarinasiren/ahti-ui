import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import * as queryString from 'query-string';

import { useOvermind } from '../overmind';

export const useUrlState = () => {
  const { state, actions } = useOvermind();
  const history = useHistory();
  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView({ href: window.location.href });
  }, [window.location.href]);

  // Keep state's pathname in sync with history.
  // For example internal links in the app.
  useEffect(() => {
    actions.setPathname(history.location.pathname);
  }, [history.location.pathname]);

  // Push state changes to url.
  useEffect(() => {
    const queryStr = queryString.stringify({
      feature: state.selectedFeature?.properties.ahtiId,
      tags: state.tagFilters.map((filter) => filter.id),
      categories: state.categoryFilters.map((category) => category.id),
      map: state.mapViewToggle,
    });
    history.push({ pathname: state.pathname, search: queryStr });
  }, [
    state.selectedFeature,
    state.categoryFilters,
    state.tagFilters,
    state.mapViewToggle,
  ]);
};
