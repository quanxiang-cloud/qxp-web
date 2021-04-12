import React, {
  useState,
} from 'react';

import Icon from '@c/icon';

import Input, { Props as InputProps } from './index';

type Props = InputProps & {
  label: string;
}

export default function PassWordField(props: Props) {
  const [type, setType] = useState<string>('text');

  return (
    <Input
      {...props}
      type={type}
      afterBeginIcon={(
        <Icon
          className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer"
          name={type === 'password' ? 'visibility_off' : 'visibility'}
          onClick={() => setType(type === 'text' ? 'password' : 'text')}
        />
      )}
    />
  );
}
