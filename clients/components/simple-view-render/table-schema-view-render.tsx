import React from 'react';

import type { Props } from '@home/pages/app-table-view-detail';
import TableViewDetail from '@home/pages/app-table-view-detail';

export default function TableSchemaViewRender(props: Props): JSX.Element {
  console.log(props);
  console.log(111);
  return (<TableViewDetail {...props} />);
}
