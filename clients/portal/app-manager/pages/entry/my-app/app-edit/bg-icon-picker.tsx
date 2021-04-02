import React from 'react';
import { Control } from '@QCFE/lego-ui';

import Select from '@c/select';

import ColorPicker from './color-picker';

type Props = {
  name: string;
  onChange?: (formData: FormData) => void;
  onBlur?: (formData: FormData) => void;
}

type FormData = {
  iconName: string;
  bgColor: BgColor
}

export default class BgIconPicker extends React.Component<Props> {
  state: FormData = {
    iconName: '',
    bgColor: 'indigo',
  }

  handleFormChange = (newFormData: any) => {
    const { onChange, onBlur } = this.props;
    this.setState(newFormData, () => {
      onChange && onChange(this.state);
      onBlur && onBlur(this.state);
    });
  };
  render() {
    return (
      <Control name={this.props.name}>
        <Select
          onChange={(iconName: string) => this.handleFormChange({ iconName })}
          options={[
            { value: 'toggle_on', label: '北京 3 区' },
            { value: 'settings', label: '广东 1 区' },
            { value: 'login', label: '广东 2 区' },
            { value: 'restore_from_trash', label: '上海 1 区' },
          ]}
        />
        <ColorPicker
          className='mt-8'
          defaultColor='indigo'
          onChange={(bgColor: BgColor) => this.handleFormChange({ bgColor })}
          iconName={this.state.iconName} />
      </Control>
    );
  }
}
