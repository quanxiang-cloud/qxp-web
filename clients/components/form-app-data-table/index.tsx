import React from 'react';

import CreateDataForm from './create-data-form';
import PageDataTable from './page-data-table';
import PageDataFilter from './page-data-filter';
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
      {store.createPageVisible ? <CreateDataForm /> : (
        <div style={style} className={`flex flex-col ${className}`}>
          <PageDataFilter />
          <PageDataTable />
        </div>
      )}
    </StoreContext.Provider>
  );
}

export default observer(FormAppDataContent);
