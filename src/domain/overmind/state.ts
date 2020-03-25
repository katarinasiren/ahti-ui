import { Feature } from '../api/generated/types.d';
import { MenuCategory } from '../../common/ui-components/Menu/Menu';
import { Filter } from '../../../alltypes';

export type State = {
  // Connected to URL parameters
  selectedFeature: Feature | null;
  tagFilters: Filter[];
  categoryFilters: Filter[];
  mapViewToggle: boolean;

  // App internal
  features: Feature[];
  featuresLoading: boolean;
};

export const state: State = {
  mapViewToggle: false,
  selectedFeature: null,
  features: [],
  featuresLoading: true,
  tagFilters: [],
  categoryFilters: [],
};
