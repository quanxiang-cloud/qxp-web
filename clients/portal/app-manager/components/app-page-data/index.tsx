import React from 'react';

import PageDataTable from './page-data-table';
import PageDataFiltrate from './page-data-filtrate';
import { PageDataContext } from './context';
import './index.scss';

type Props = {
  filtrates: PageField[];
  tableColumns: any;
}

function AppPageData({ filtrates, tableColumns }: Props) {
  return (
    <PageDataContext.Provider value={{ filtrates, tableColumns }}>
      <div className='flex flex-col'>
        <PageDataFiltrate filtrates={filtrates} />
        <PageDataTable tableColumns={tableColumns} />
      </div>
    </PageDataContext.Provider>
  );
}

export default AppPageData;
