import React from 'react';
import { groupBy } from 'ramda';
import { nanoid } from 'nanoid';

import { Input } from '@flow/content/editor/type';
import Block from './block';

interface Props {
  value?: Input[];
  onChange: (value: Input[]) => void;
}

export default function Send({ value, onChange }: Props): JSX.Element {
  const { header = [], body = [], query = [] } = groupBy(
    ({ in: _in }) => _in as 'header' | 'body' | 'query', value?.filter(({ in: _in }) => !!_in) || [],
  );

  function handleChange(
    id: string, key: string, val: string, type: 'header' | 'body' | 'query', index: number,
  ): void {
    const newValue = value?.map((v) => {
      if (v.id === id) {
        return { ...v, [key]: val };
      }
      return v;
    }) || [];

    let list = [];
    if (type === 'header') {
      list = header;
    } else if (type === 'body') {
      list = body;
    } else if (type === 'query') {
      list = query;
    }

    if (index === list.length - 1) {
      newValue.push({ type: 'string', in: type, name: '', data: '', id: nanoid() });
    }
    onChange(newValue);
  }

  function handleRemove(id: string): void {
    onChange(value?.filter(({ id: _id }) => _id !== id) ?? []);
  }

  // console.log(header, body, query);

  return (
    <div className="pr-8">
      <Block type="header" value={header} onChange={handleChange} onRemove={handleRemove} />
      <Block type="body" value={body} onChange={handleChange} onRemove={handleRemove} />
      <Block type="query" value={query} onChange={handleChange} onRemove={handleRemove} />
    </div>
  );
}
