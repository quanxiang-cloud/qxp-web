import React, { Fragment } from 'react';

import { Input } from '@flow/content/editor/type';
import Icon from '@c/icon';

import './style.scss';

interface Props {
  value: Input[];
  onChange: (
    id: string, key: string, value: string, type: 'header' | 'body' | 'query', index: number
  ) => void;
  onRemove: (id: string) => void;
  type: 'header' | 'body' | 'query';
}

export default function SendBlock({ value = [], onChange, onRemove, type }: Props): JSX.Element {
  function handleChange(key: string, row: Input, val: string, index: number): void {
    row.id && onChange(row.id, key, val, type, index);
  }

  return (
    <>
      <h1 className="mt-8 mb-4 text-gray-900 text-h6-no-color-weight">{type}</h1>
      <div className="bg-white border rounded-8 grid webhook-send-block">
        <div className="webhook-send-block--key">key</div>
        <div className="webhook-send-block--value">value</div>
        {value.map((row, index) => {
          if (!row.id) {
            return null;
          }
          return (
            <Fragment key={row.id}>
              <div className="webhook-send-block--key">
                <input
                  value={row.name}
                  onChange={(e) => handleChange('name', row, e.target.value, index)}
                  placeholder="新建参数"
                  className="border-none flex-1"
                />
              </div>
              <div className="webhook-send-block--value flex justify-between">
                <input
                  value={row.data as string}
                  onChange={(e) => handleChange('data', row, e.target.value, index)}
                  className="border-none flex-1"
                />
                {(index !== value.length - 1) && (
                  <Icon name="delete" clickable onClick={() => row.id && onRemove(row.id)} />
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
