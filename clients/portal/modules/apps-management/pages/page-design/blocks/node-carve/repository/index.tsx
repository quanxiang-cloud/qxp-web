import { Repository } from '@one-for-all/artery-renderer';
import { Checkbox, Input, Select, Switch, RadioGroup, CheckboxGroup } from '@one-for-all/headless-ui';

import functionbind from './function-bind';
import statebind from './state-bind';
import imageurl, { UrlInputProps } from './url-input';
import variablebind from './variable-bind';
import unavaliable from './unavaliable';
import tips from './tips';
import { connect } from '../utils/connect';

const repo: Repository = {
  'node-carve@1.0.0': {
    input: connect(Input, { defaultProps: { className: 'w-full' } }),
    switch: connect(Switch, { valueKey: 'checked' }),
    select: connect(Select),
    radiogroup: connect(RadioGroup),
    checkboxgroup: connect(CheckboxGroup),
    numberpicker: connect(Input, { defaultProps: { className: 'w-full', type: 'number' } }),
    textarea: connect(Input, { defaultProps: { className: 'w-full', type: 'textarea' } }),
    checkbox: connect(Checkbox, {
      valueKey: 'checked',
      getValue(...args) {
        return args[1]?.target?.checked;
      },
    }),
    imageurl: connect<UrlInputProps>(imageurl),
    functionbind,
    variablebind,
    statebind,
    tips,
    unavaliable,
  },
};

export default repo;
