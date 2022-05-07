import { Repository } from '@one-for-all/artery-renderer';
import { Checkbox, Input, Select, Switch } from '@one-for-all/headless-ui';
import { connect } from '../utils/connect';
import FunctionBind from './function-bind';
import StateBind from './state-bind';
import Tips from './tips';
import UrlInput, { UrlInputProps } from './url-input';
import VaribleBind from './varible-bind';
import Unavaliable from './unavaliable';

const repo: Repository = {
  'node-carve@1.0.0': {
    input: connect(Input, { defaultProps: { className: 'w-full' } }),
    switch: connect<any>(Switch, { valueKey: 'checked' }),
    select: connect<any>(Select),
    numberpicker: connect(Input, { defaultProps: { className: 'w-full', type: 'number' } }),
    textarea: connect(Input, { defaultProps: { className: 'w-full', type: 'textarea' } } ),
    checkbox: connect<any>(Checkbox, { valueKey: 'checked', getValue(...args) {
      return args[1]?.target?.checked;
    } }),
    imageurl: connect<UrlInputProps>(UrlInput),
    functionbind: FunctionBind,
    variblebind: VaribleBind,
    statebind: StateBind,
    tips: Tips,
    unavaliable: Unavaliable,
  },
};

export default repo;
