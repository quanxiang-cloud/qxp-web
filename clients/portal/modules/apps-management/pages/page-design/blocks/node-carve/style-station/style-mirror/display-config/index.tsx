import React, { CSSProperties } from 'react';
import { Icon, Tooltip } from '@one-for-all/ui';

import StyleSubTitle from '../components/style-sub-title';
import RadioButtonGroup from '../components/radio-button-group';
import { PartialCSSProperties } from '../../utils';
import {
  JUSTIFY_ICON_MAP,
  ALIGN_ICON_MAP,
  DISPLAY_OPTION,
  DIRECTION_LIST,
  JUSTIFY_CONTENT_VALUE,
  ALIGN_CONTENT_VALUE,
} from '../constant';

export type Props = {
  defaultValue: DisplayValue;
  onChange: (value: CSSProperties) => void;
  onReset?: () => void;
}

export type DisplayValue = PartialCSSProperties<
'display' | 'flexDirection' | 'justifyContent' | 'alignItems'
>;

function DisplayConfig({ defaultValue, onChange, onReset }: Props): JSX.Element {
  function directionOptionsRender(data: LabelValue, index: number): JSX.Element {
    return (
      <Tooltip
        position='top'
        label={data.value}
      >
        <Icon
          style={{ transform: `rotate(${index * 90}deg)` }}
          className='transform'
          size={16}
          name='direction_row'
        />
      </Tooltip>
    );
  }

  function flexLayoutOptionsRender(data: LabelValue, type: string): JSX.Element {
    const { flexDirection } = defaultValue;
    const iconMap = type === 'justify' ? JUSTIFY_ICON_MAP : ALIGN_ICON_MAP;
    let transformStyle = {};
    if (flexDirection === 'row-reverse') {
      transformStyle = { transform: 'rotateY(180deg)' };
    }

    if (flexDirection === 'column') {
      transformStyle = { transform: 'rotate(-90deg) rotateY(180deg)' };
    }

    if (flexDirection === 'column-reverse') {
      transformStyle = { transform: 'rotate(-90deg)' };
    }

    return (
      <Tooltip
        position='top'
        label={`${data.value}:${data.label}`}
      >
        <Icon
          style={transformStyle}
          className='transform'
          size={16}
          color='gray'
          name={iconMap[data.value]}
        />
      </Tooltip>
    );
  }

  function handleChange(displayStyle: DisplayValue): void {
    if (displayStyle.display && displayStyle.display !== 'flex') {
      onChange({
        display: displayStyle.display,
        flexDirection: undefined,
        justifyContent: '',
        alignItems: '',
      });
      return;
    }
    onChange(displayStyle);
  }

  return (
    <>
      <StyleSubTitle title='显示方式 (Display)' onResetValue={onReset} />
      <RadioButtonGroup
        data={DISPLAY_OPTION}
        current={defaultValue.display}
        buttonContentRender={(data) => <span className='text-12'>{data.label}</span>}
        onChange={(display) => {
          handleChange({ display });
        }}
      />

      {
        defaultValue.display === 'flex' && (
          <>
            <StyleSubTitle title='布局方向 (Flex Direction)' />
            <RadioButtonGroup
              data={DIRECTION_LIST}
              current={defaultValue.flexDirection}
              buttonContentRender={directionOptionsRender}
              onChange={(flexDirection) => {
                handleChange({ flexDirection: flexDirection as any });
              }}
            />

            <StyleSubTitle title='主轴排列 (Justify Content)' />
            <RadioButtonGroup
              data={JUSTIFY_CONTENT_VALUE}
              current={defaultValue.justifyContent}
              buttonContentRender={(data) => flexLayoutOptionsRender(data, 'justify')}
              onChange={(justifyContent) => {
                handleChange({ justifyContent });
              }}
            />

            <StyleSubTitle title='交叉轴排列 (Align Items)' />
            <RadioButtonGroup
              data={ALIGN_CONTENT_VALUE}
              current={defaultValue.alignItems}
              buttonContentRender={(data) => flexLayoutOptionsRender(data, 'align')}
              onChange={(alignItems) => {
                handleChange({ alignItems });
              }}
            />
          </>
        )
      }
    </>
  );
}

export default DisplayConfig;
