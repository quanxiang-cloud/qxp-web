import { Input } from '@one-for-all/ui';

import type { SourceElement } from '@pageDesign/types';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  name?: string,
  placeholder?: string,
  rows?: number,
  cols?: number,
  required?: boolean,
  disable?: boolean,
}

const elem: SourceElement<Props> = {
  name: 'input',
  icon: 'text_fields',
  label: '单行文本',
  category: 'form',
  component: Input,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 1,
  exportActions: ['onChange', 'onKeyDown', 'onBlur', 'onFocus'],
  defaultStyle: {
    display: 'inline-block',
  },
};
export default elem;
