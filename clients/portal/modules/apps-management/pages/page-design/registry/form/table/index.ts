import type { SourceElement } from '@pageDesign/types';

import Table from './table';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'table',
  icon: 'border_all',
  label: '表格',
  category: 'form',
  component: Table,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 4,
  defaultStyle: {
    display: 'block',
  },
};
export default elem;
