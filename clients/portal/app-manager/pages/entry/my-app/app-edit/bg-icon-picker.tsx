import React from 'react';
import { Control } from '@QCFE/lego-ui';

import Select from '@c/select';
import Icon from '@c/icon';

import ColorPicker from './color-picker';

type Props = {
  name: string;
  defaultAppIcon?: AppIcon;
  onChange?: (formData: AppIcon) => void;
  onBlur?: (formData: AppIcon) => void;
}

export default class BgIconPicker extends React.Component<Props> {
  state: AppIcon = {
    iconName: this.props.defaultAppIcon?.iconName || '',
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
    const { name, defaultAppIcon = { iconName: '', bgColor: 'indigo' } } = this.props;
    return (
      <Control name={name}>
        <Select
          onChange={(iconName: string) => this.handleFormChange({ iconName })}
          defaultValue={defaultAppIcon.iconName}
          options={[
            { value: 'toggle_on', label: <Icon size={24} name='toggle_on' /> },
            { value: 'settings', label: <Icon size={24} name='settings' /> },
            { value: 'login', label: <Icon size={24} name='login' /> },
            { value: 'restore_from_trash', label: <Icon size={24} name='restore_from_trash' /> },
          ]}
        />
        <ColorPicker
          className='mt-8'
          defaultColor={defaultAppIcon.bgColor}
          onChange={(bgColor: BgColor) => this.handleFormChange({ bgColor })}
          iconName={this.state.iconName} />
      </Control>
    );
  }
}
