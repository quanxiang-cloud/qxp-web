import { useMemo } from 'react';

import TableViewStore from './store';
import type { Props as TableViewsProps } from './index';

export default function useTableViewStore( props: TableViewsProps): TableViewStore {
  return useMemo( () => new TableViewStore(props), []);
}
