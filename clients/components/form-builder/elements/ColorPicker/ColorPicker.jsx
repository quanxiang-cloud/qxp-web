import React, { useState, useEffect } from 'react';
import { TwitterPicker } from 'react-color';
import { Dropdown } from 'antd';
import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid #ccc;
  border-radius: 2px;
  background-color: #fff;
  padding: 4px;
  width: 80px;
`;

const ColorBar = styled.div`
  background-color: ${props => props.color};
  height: 16px;
  cursor: pointer;
`;

const PickerWrapper = styled.div`
  padding-top: 10px;
`;

const ColorPicker = props => {
  const { value = '#0693e3' } = props;
  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState(value);

  const handleVisibleChange = flag => {
    setVisible(flag);
  };

  const handleColorChange = colorValue => {
    const { onChange, mutators } = props;
    const handleChange = mutators ? mutators.change : onChange;
    const { hex } = colorValue;
    setColor(hex);
    return handleChange(hex);
  };

  const overlay = (
    <PickerWrapper>
      <TwitterPicker onChange={handleColorChange} color={color} />
    </PickerWrapper>
  );

  useEffect(() => {
    setColor(value);
  }, [value]);

  return (
    <Wrapper>
      <Dropdown
        overlay={overlay}
        trigger={['click']}
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <ColorBar color={color} />
      </Dropdown>
    </Wrapper>
  );
};

ColorPicker.isFieldComponent = true;

export default ColorPicker;
