import React from 'react';

import SearchControlField, { Props as SearchControlFieldProps } from './search-control-field';
import SearchControlIcon from './search-control-icon';

export type Props = SearchControlFieldProps;

const searchControl = (props: Props): JSX.Element => {
  const { value, onChange } = props;

  return (
    <div className="relative my-10 flex-shrink-0">
      <SearchControlField {...props} />
      <SearchControlIcon value={value} onChange={onChange} />
    </div>
  );
};

export default searchControl;
