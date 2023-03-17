import { Placement } from '@popperjs/core';

export const PARAMS_MAP = {
  FORM_DATA: '工作表触发',
  FORM_TIME: '定时触发',
  'form-data': '工作表触发',
  'form-time': '定时触发',
  'timer-trigger': '定时触发',
};

export const POPPER_PARAMS = {
  modifiers: [{ name: 'offset', options: { offset: [0, 6] } }],
  placement: 'bottom-start' as Placement,
};
