import React from 'react';
import { Control } from '@QCFE/lego-ui';

import Icon from '@c/icon';

import IconSelect from '../icon-select';
import ColorPicker from './color-picker';
import './index.scss';

type Props = {
  name: string;
  defaultAppIcon?: AppIcon;
  onChange?: (formData: AppIcon) => void;
  onBlur?: (formData: AppIcon) => void;
}

export default class BgIconPicker extends React.Component<Props> {
  state: AppIcon;
  constructor(props: Props) {
    super(props);
    this.state = {
      iconName: props.defaultAppIcon?.iconName || '',
      bgColor: props.defaultAppIcon?.bgColor || 'indigo',
    };

    const { defaultAppIcon, onChange, onBlur } = props;
    if (defaultAppIcon) {
      onChange && onChange(defaultAppIcon);
      onBlur && onBlur(defaultAppIcon);
    }
  }

  handleFormChange = (newFormData: any) => {
    const { onChange, onBlur } = this.props;
    this.setState(newFormData, () => {
      onChange && onChange(this.state);
      onBlur && onBlur(this.state);
    });
  };

  render() {
    const { bgColor, iconName } = this.state;
    return (
      <Control name={this.props.name}>
        <IconSelect
          onChange={(_iconName: string) => this.handleFormChange({ iconName: _iconName })}
          value={iconName}
          options={[
            { value: 'toggle_on', label: <Icon size={24} name='toggle_on' /> },
            { value: 'settings', label: <Icon size={24} name='settings' /> },
            { value: 'login', label: <Icon size={24} name='login' /> },
            { value: 'restore_from_trash', label: <Icon size={24} name='restore_from_trash' /> },
          ]} />
        <ColorPicker
          className='mt-8'
          defaultColor={bgColor}
          onChange={(bgColor: BgColor) => this.handleFormChange({ bgColor })}
          iconName={iconName} />
      </Control>
    );
  }
}
