import React from 'react';
import { Control } from '@QCFE/lego-ui';

import IconSelect from '@c/app-icon-select';
import ColorPicker from './color-picker';

import { BgColor } from '@c/app-icon';

type AppIconInfo = {
  bgColor: BgColor;
  iconName: string;
}

type Props = {
  name: string;
  defaultAppIcon?: AppIconInfo;
  onChange?: (formData: AppIconInfo) => void;
  onBlur?: (formData: AppIconInfo) => void;
}

export default class AppIconPicker extends React.Component<Props> {
  state: AppIconInfo;
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
        />
        <ColorPicker
          className='mt-8'
          defaultColor={bgColor}
          onChange={(bgColor: BgColor) => this.handleFormChange({ bgColor })}
          iconName={iconName} />
      </Control>
    );
  }
}
