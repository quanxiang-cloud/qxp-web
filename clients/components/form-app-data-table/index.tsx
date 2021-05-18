import React from 'react';

import PageDataTable from './page-data-table';
import PageDataFiltrate from './page-data-filtrate';
import './index.scss';

type Props = {
  className?: string;
  style?: React.CSSProperties
}

function FormAppDataTable({ className = '', style }: Props) {
  return (
    <div style={style} className={`flex flex-col ${className}`}>
      <PageDataFiltrate />
      <PageDataTable />
    </div>
  );
}

export default FormAppDataTable;
