import Checkbox from './checkbox';
import ConfigForm from './config-form';
import type { SourceElement } from '../../../types';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'checkbox',
  icon: 'apps',
  label: '多选',
  category: 'form',
  component: Checkbox,
  configForm: ConfigForm,
  defaultConfig,
  order: 4,
};

export default elem;
