import type { SourceElement } from '@pageDesign/types';

import Paginator from './paginator';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'paginator',
  icon: 'apps',
  label: '分页器',
  category: 'advanced',
  component: Paginator,
  configForm: ConfigForm,
  defaultConfig,
  order: 2,
};

export default elem;
