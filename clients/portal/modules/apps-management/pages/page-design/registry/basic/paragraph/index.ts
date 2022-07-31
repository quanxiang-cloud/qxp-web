import { Paragraph } from '@one-for-all/ui';

import type { SourceElement } from '@pageDesign/types';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  name?: string
}

const elem: SourceElement<Props> = {
  name: 'para',
  icon: 'short_text',
  label: '段落',
  category: 'basic',
  component: Paragraph,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 2,
  exportActions: ['onClick'],
};

export default elem;
