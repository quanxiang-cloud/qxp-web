import type { SourceElement } from '@pageDesign/types';

import Form from './form';
import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'form',
  icon: 'schema-form',
  label: '表单',
  category: 'form',
  component: Form,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 3,
  acceptChild: true,
  exportActions: ['onSubmit'],
  defaultStyle: {
    display: 'block',
  },
};
export default elem;
