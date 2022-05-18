import { Repository } from '@one-for-all/artery-renderer';

import { Textarea } from '@one-for-all/ui';
import { Checkbox, Input, Select, Switch, RadioGroup, CheckboxGroup } from '@one-for-all/headless-ui';

import { connect } from '../utils/connect';
import functionbind from './function-bind';
import statebind from './state-bind';
import imageurl, { UrlInputProps } from './url-input';
import variablebind from './variable-bind';
import unavaliable from './unavaliable';
import tips from './tips';

const repo: Repository = {
  'node-carve@1.0.0': {
    input: connect(Input, { defaultProps: { className: 'w-full' } }),
    switch: connect(Switch, { valueKey: 'checked' }),
    select: connect(Select),
    radiogroup: connect(RadioGroup),
    checkboxgroup: connect(CheckboxGroup),
    numberpicker: connect(Input, { defaultProps: { className: 'w-full', type: 'number' } }),
    textarea: connect(Textarea, { defaultProps: { className: 'w-full' }, getValue: (e) => e?.target?.value }),
    checkbox: connect(Checkbox, { valueKey: 'checked', getValue: (val, e) => e?.target?.checked }),
    imageurl: connect<UrlInputProps>(imageurl),
    functionbind,
    variablebind,
    statebind,
    tips,
    unavaliable,
  },
};

export default repo;
