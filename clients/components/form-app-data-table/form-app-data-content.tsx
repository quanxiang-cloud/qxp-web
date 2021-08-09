import React from 'react';
import { observer } from 'mobx-react';

import PageDataTable from './page-data-table';
import PageDataFilter from './page-data-filter';
import { StoreContext } from './context';
import Store from './store';
import './index.scss';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  store: Store;
}

function FormAppDataContent({ className = '', style, store }: Props): JSX.Element {
  return (
    <StoreContext.Provider value={store}>
      <div style={style} className={`flex flex-col ${className}`}>
        <PageDataFilter />
        <PageDataTable />
      </div>
    </StoreContext.Provider>
  );
}

export default observer(FormAppDataContent);
