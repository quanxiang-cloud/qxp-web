import React from 'react';

import PageDataTable from './page-data-table';
import PageDataFiltrate from './page-data-filtrate';
import './index.scss';

type Props = {
  className?: string;
}

function AppPageData({ className = '' }: Props) {
  return (
    <div className={`flex flex-col ${className}`}>
      <PageDataFiltrate />
      <PageDataTable />
    </div>
  );
}

export default AppPageData;
