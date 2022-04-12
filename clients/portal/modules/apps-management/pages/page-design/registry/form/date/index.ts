import DatePicker from './date';
import ConfigForm from './config-form';
import type { SourceElement } from '../../../types';

type Props = {
  name?: string
}

const defaultConfig: Props = {};

const elem: SourceElement<Props> = {
  name: 'date',
  icon: 'apps',
  label: '日期',
  category: 'form',
  component: DatePicker,
  configForm: ConfigForm,
  defaultConfig,
  order: 7,
};

export default elem;
