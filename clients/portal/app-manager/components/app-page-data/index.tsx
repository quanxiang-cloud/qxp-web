import React, { useEffect } from 'react';

import PageDataTable from './page-data-table';
import PageDataFiltrate from './page-data-filtrate';
import store from './store';
import './index.scss';

function AppPageData() {
  useEffect(() => {
    return () => {
      store.clear();
    };
  }, []);

  return (
    <div className='flex flex-col'>
      <PageDataFiltrate />
      <PageDataTable />
    </div>
  );
}

export default AppPageData;
