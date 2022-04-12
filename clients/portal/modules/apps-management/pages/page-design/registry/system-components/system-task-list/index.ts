import TaskList from '@c/task-lists';
import type { SourceElement } from '../../../types';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  placeholder: string,
  rows: number,
  cols: number,
  name: string,
}

const elem: SourceElement<Props> = {
  name: 'SystemTaskList',
  icon: 'wrap_text',
  label: '任务列表',
  category: 'inner',
  component: TaskList,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 2,
  // acceptChild: true,
  defaultStyle: {
    display: 'inline-block',
  },
  exportActions: ['onChange', 'onKeyDown', 'onBlur', 'onFocus'],
};

export default elem;
