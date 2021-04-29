import React from 'react';

import PageDataTable from './page-data-table';
import PageDataFiltrate from './page-data-filtrate';
import './index.scss';

function AppPageData() {
  return (
    <div className='flex flex-col'>
      <PageDataFiltrate />
      <PageDataTable />
    </div>
  );
}

export default AppPageData;
