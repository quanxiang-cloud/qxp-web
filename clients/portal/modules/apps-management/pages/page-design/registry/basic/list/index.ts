import type { SourceElement } from '@pageDesign/types';

import List from './list';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'list',
  icon: 'apps',
  label: '列表',
  category: 'basic',
  component: List,
  configForm: ConfigForm,
  defaultConfig,
  order: 7,
};

export default elem;
