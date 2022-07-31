import { Page } from '@one-for-all/ui';

import type { SourceElement } from '@pageDesign/types';

import ConfigForm from './config-form';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'page',
  icon: 'apps',
  label: '页面',
  category: 'basic',
  component: Page,
  configForm: ConfigForm,
  defaultConfig,
  hidden: true,
  acceptChild: true,
  defaultStyle: {
    // width: '100%',
  },
};

export default elem;
