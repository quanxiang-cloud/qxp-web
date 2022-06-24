import React from 'react';
import { observer } from 'mobx-react';
import { omit } from 'lodash';

import Icon from '@one-for-all/icon';
import { RadioGroup } from '@one-for-all/headless-ui';

import { BoxShadowTypes } from '../constants/constants-types';
import { TokenBoxshadowUnit, TokenBoxshadowValue } from '../types/values';
import ColorPicker from './color-picker';
import TokenValueInput from './TokenValueInput';
import DesignTokenStore from '../store';
import store from '../../store';
import { getAliasValue } from '../utils/aliases';

function SingleShadowInput({
  value,
  unit,
  isMultiple = false,
  shadowItem,
  index,
  onValueChange,
  onUnitChange,
  onRemove,
}: {
  value: TokenBoxshadowValue | TokenBoxshadowValue[];
  unit: TokenBoxshadowUnit | TokenBoxshadowUnit[];
  isMultiple?: boolean;
  shadowItem: TokenBoxshadowValue;
  index: number;
  onValueChange: (shadow: TokenBoxshadowValue | TokenBoxshadowValue[]) => void;
  onUnitChange: (shadow: TokenBoxshadowUnit | TokenBoxshadowUnit[]) => void;
  onRemove?: (index: number) => void;
}): JSX.Element {
  const { resolvedTokens } = store.designTokenStore as DesignTokenStore;

  const handleValueChange = (
    obj: TokenBoxshadowValue | TokenBoxshadowValue[],
    key: string,
    newValue: string,
  ): void => {
    if (Array.isArray(obj)) {
      const values = obj;
      const newShadow = { ...obj[index], [key]: newValue };
      values.splice(index, 1, newShadow);

      onValueChange(values);
    } else {
      onValueChange({ ...obj, [key]: newValue });
    }
  };

  const handleUnitChange = (
    obj: TokenBoxshadowUnit | TokenBoxshadowUnit[],
    key: string,
    newValue: string,
  ): void => {
    if (Array.isArray(obj)) {
      const values = obj;
      const newShadow = { ...obj[index], [key]: newValue };
      values.splice(index, 1, newShadow);

      onUnitChange(values);
    } else {
      onUnitChange({ ...obj, [key]: newValue });
    }
  };

  return (
    <div className="flex flex-col border-b-1 border-gray-200">
      <div className="flex justify-between items-center px-20 py-4">
        <RadioGroup
          value={shadowItem.type}
          onChange={(val: string) => handleValueChange(value, 'type', val)}
          options={[
            { label: 'inset', value: BoxShadowTypes.INSET },
            { label: 'outset', value: BoxShadowTypes.OUTSET },
          ]}
        />
        {isMultiple && (
          <span onClick={() => onRemove?.(index)}>
            <Icon name="minus" size={24} />
          </span>
        )}
      </div>
      <div className="flex flex-col">
        {Object.entries(omit(shadowItem, ['type'])).map(
          ([key, _value], index) => {
            const resolvedValue = _value ?
              getAliasValue(_value, resolvedTokens) :
              null;
            return (
              <TokenValueInput
                key={`${key}${index}`}
                name={key}
                label={key}
                value={_value}
                onChange={(e) => handleValueChange(value, e.target.name, e.target.value)}
                type={key}
                preAddon={
                  key === 'color' && (
                    <ColorPicker
                      className="w-20 h-20 border-1 border-gray-400 mr-4"
                      value={resolvedValue ? resolvedValue : _value}
                      onChange={(color) => handleValueChange(value, 'color', color)}
                    />
                  )
                }
                afterAddon={
                  key in unit && (
                    <input
                      type="text"
                      className="w-40 p-4"
                      value={unit[key as keyof typeof unit]}
                      name={key}
                      onChange={(e) => handleUnitChange(unit, key, e.target.value)}
                    />
                  )
                }
              />
            );
          },
        )}
      </div>
    </div>
  );
}

const newToken: TokenBoxshadowValue = {
  x: '0',
  y: '0',
  blur: '0',
  spread: '0',
  color: '#000000',
  type: BoxShadowTypes.OUTSET,
};

const newTokenUnit: TokenBoxshadowUnit = {
  x: 'px',
  y: 'px',
  blur: 'px',
  spread: 'px',
};

function BoxShadowInput({
  value,
  unit,
  onValueChange,
  onUnitChange,
}: {
  value: TokenBoxshadowValue | TokenBoxshadowValue[];
  unit: TokenBoxshadowUnit | TokenBoxshadowUnit[];
  onValueChange: (shadow: TokenBoxshadowValue | TokenBoxshadowValue[]) => void;
  onUnitChange: (shadow: TokenBoxshadowUnit | TokenBoxshadowUnit[]) => void;
}): JSX.Element {
  const addShadow = (): void => {
    if (Array.isArray(value)) {
      onValueChange([...value, newToken]);
    } else {
      onValueChange([value, newToken]);
    }
    if (Array.isArray(unit)) {
      onUnitChange([...unit, newTokenUnit]);
    } else {
      onUnitChange([unit, newTokenUnit]);
    }
  };

  const removeShadow = (index: number): void => {
    if (Array.isArray(value)) {
      onValueChange(value.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center px-20">
        <h3>Shadow</h3>
        <span onClick={addShadow}>
          <Icon name="add" size={24}></Icon>
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {Array.isArray(value) ? (
          value.map((token, index) => (
            <SingleShadowInput
              isMultiple
              value={value}
              unit={unit}
              onUnitChange={onUnitChange}
              onValueChange={onValueChange}
              shadowItem={token}
              index={index}
              key={`single-shadow-${index}`}
              onRemove={removeShadow}
            />
          ))
        ) : (
          <SingleShadowInput
            unit={unit}
            onUnitChange={onUnitChange}
            onValueChange={onValueChange}
            index={0}
            value={value}
            shadowItem={value}
          />
        )}
      </div>
    </div>
  );
}

export default observer(BoxShadowInput);
