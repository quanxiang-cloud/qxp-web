import { Placement } from '@popperjs/core';

export const PARAMS_MAP = {
  FORM_DATA: '工作表触发',
  FORM_TIME: '工作表时间触发',
  'form-data': '工作表触发',
  'form-time': '工作表时间触发',
};

export const POPPER_PARAMS = {
  modifiers: [{ name: 'offset', options: { offset: [0, 6] } }],
  placement: 'bottom-start' as Placement,
};
