import { Repository } from '@one-for-all/artery-renderer';
import { Checkbox, Input, Select, Switch } from '@one-for-all/headless-ui';
import { connect } from '../utils/connect';
import FunctionBind from './function-bind';
import StateBind from './state-bind';
import Tips from './tips';
import UrlInput from './url-input';
import VaribleBind from './varible-bind';
import Unavaliable from './unavaliable';

const repo: Repository = {
  'node-carve@1.0.0': {
    Input: connect(Input, { defaultProps: { className: 'w-full' } }),
    Switch: connect<any>(Switch, { valueKey: 'checked' }),
    Select: connect<any>(Select),
    NumberPicker: connect(Input, { defaultProps: { className: 'w-full', type: 'number' } }),
    Textarea: connect(Input, { defaultProps: { className: 'w-full', type: 'textarea' } } ),
    Checkbox: connect<any>(Checkbox, { valueKey: 'checked', getValue(...args) {
      return args[1]?.target?.checked;
    } }),
    ImageUrl: UrlInput,
    FunctionBind,
    VaribleBind,
    StateBind,
    Tips,
    Unavaliable,
  },
};

export default repo;
