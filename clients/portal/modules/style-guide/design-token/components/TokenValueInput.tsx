import { observer } from 'mobx-react';
import React, { ChangeEvent, ReactNode } from 'react';
import store from '../../store';
import DesignTokenStore from '../store';
import { checkIfContainsAlias, getAliasValue } from '../utils/aliases';

interface Props {
  label: string;
  name: string;
  value?: string;
  type?: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  preAddon?: ReactNode;
  afterAddon?: ReactNode;
}

function TokenValueInput({
  label,
  name,
  type,
  value = '',
  disabled = false,
  onChange,
  preAddon,
  afterAddon,
}: Props): JSX.Element {
  const { resolvedTokens } = store.designTokenStore as DesignTokenStore;

  const resolvedValue = value ? getAliasValue(value, resolvedTokens) : null;

  return (
    <div className="flex flex-col justify-center px-20 py-4">
      <label>{label}</label>
      <div className="flex">
        {preAddon}
        <input
          className="flex-1 p-4 mr-4"
          value={value}
          onChange={onChange}
          type="text"
          name={name}
          disabled={disabled}
        />
        {afterAddon}
      </div>
      {value && checkIfContainsAlias(value as string) && (
        <div className="flex mt-6 item-center">
          {type === 'color' ? (
            <div
              className="w-20 h-20 mr-4 border border-gray-200 bg-gray-100 rounded"
              style={resolvedValue ? { background: resolvedValue } : {}}
            />
          ) : null}
          {resolvedValue}
        </div>
      )}
    </div>
  );
}

export default observer(TokenValueInput);
