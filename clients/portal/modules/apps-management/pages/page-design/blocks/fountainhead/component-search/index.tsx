import React from 'react';

import SearchControl, { Props as SearchControlProps } from './search-control';
import SearchResultList, { Props as SearchResultListProps } from './search-result-list';

export type Props = SearchControlProps & SearchResultListProps;

const ComponentSearch = ({ value, onChange, placeholder, ...props }: Props): JSX.Element => {
  return (
    <>
      <SearchControl value={value} onChange={onChange} placeholder={placeholder} />
      <SearchResultList {...props} />
    </>
  );
};

export default ComponentSearch;
