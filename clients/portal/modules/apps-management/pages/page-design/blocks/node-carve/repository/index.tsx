import { FC } from 'react';
import { ColorResult } from 'react-color';

import { Repository } from '@one-for-all/artery-renderer';
import { Textarea, ColorPicker } from '@one-for-all/ui';
import {
  Checkbox,
  Input,
  Select,
  Switch,
  RadioGroup,
  CheckboxGroup,
  DatePicker,
  TimePicker,
  DateTimePicker,
} from '@one-for-all/headless-ui';

import { connect } from '../utils/connect';
import FunctionBind from './function-bind';
import StateBind from './state-bind';
import ImageUrl, { UrlInputProps } from './url-input';
import VariableBind from './variable-bind';
import Unavaliable from './unavaliable';
import Tips from './tips';
import UrlInputGroup from './url-input-group';

const { formatRgba }: any = ColorPicker;

const repoMap: Record<string, FC<any>> = {
  Input: connect(Input, { defaultProps: { className: 'w-full' } }),
  Switch: connect(Switch, { valueKey: 'checked' }),
  Select: connect(Select),
  RadioGroup: connect(RadioGroup),
  CheckboxGroup: connect(CheckboxGroup),
  NumberPicker: connect(Input, { defaultProps: { className: 'w-full', type: 'number' } }),
  Textarea: connect(Textarea, { defaultProps: { className: 'w-full' }, getValue: (e) => e?.target?.value }),
  Checkbox: connect(Checkbox, { valueKey: 'checked', getValue: (val, e) => e?.target?.checked }),
  Imageurl: connect<UrlInputProps>(ImageUrl),
  ImageUrlGroup: connect(UrlInputGroup),
  DatePicker: connect(DatePicker, { defaultProps: { className: 'w-full' } }),
  TimePicker: connect(TimePicker, { defaultProps: { className: 'w-full' } }),
  DateTimePicker: connect(DateTimePicker, { defaultProps: { className: 'w-full' } }),
  ColorPicker: connect(ColorPicker, { getValue: (val: ColorResult) => formatRgba(val.rgb) }),
  FunctionBind,
  VariableBind,
  StateBind,
  Tips,
  Unavaliable,
};

const repo: Repository = {
  'node-carve@1.0.0': Object.entries(repoMap)?.reduce<Record<string, FC<any>>>((res, [key, comp]) => {
    return {
      ...res,
      [key.toLowerCase()]: comp,
    };
  }, {}),
};

export default repo;
