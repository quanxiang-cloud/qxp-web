import { Repository } from '@one-for-all/artery-renderer';
import { Checkbox, Input, Select, Switch, RadioGroup, CheckboxGroup } from '@one-for-all/headless-ui';

import FunctionBind from './function-bind';
import StateBind from './state-bind';
import UrlInput, { UrlInputProps } from './url-input';
import VariableBind from './variable-bind';
import Unavaliable from './unavaliable';
import Tips from './tips';
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
    imageurl: connect<UrlInputProps>(UrlInput),
    functionbind: FunctionBind,
    variblebind: VariableBind,
    statebind: StateBind,
    tips: Tips,
    unavaliable: Unavaliable,
  },
};

export default repo;
