import type { SourceElement } from '@pageDesign/types';

import MultiSelect from './multi-select';
import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'multi_select',
  icon: 'apps',
  label: 'δΈζε€ι',
  category: 'form',
  component: MultiSelect,
  configForm: ConfigForm,
  defaultConfig,
  order: 6,
};

export default elem;
