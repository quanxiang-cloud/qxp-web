import type { SourceElement } from '@pageDesign/types';

import RadioGroupElm from './radio';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'radio',
  icon: 'radio_button_checked',
  label: '单选',
  category: 'form',
  component: RadioGroupElm,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 2,
  exportActions: ['onChange'],
};
export default elem;

