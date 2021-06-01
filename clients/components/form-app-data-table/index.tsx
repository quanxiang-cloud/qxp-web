import React from 'react';

import PageDataTable from './page-data-table';
import PageDataFiltrate from './page-data-filtrate';
import { StoreContext } from './context';
import Store from './store';
import './index.scss';
import { observer } from 'mobx-react';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  store: Store;
}

function FormAppDataContent({ className = '', style, store }: Props) {
  return (
    <StoreContext.Provider value={store}>
      <div style={style} className={`flex flex-col ${className}`}>
        <PageDataFiltrate />
        <PageDataTable />
      </div>
    </StoreContext.Provider>
  );
}

export default observer(FormAppDataContent);
