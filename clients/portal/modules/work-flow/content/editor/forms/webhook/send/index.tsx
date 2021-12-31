import React, { forwardRef, ForwardedRef, useImperativeHandle, useRef } from 'react';
import { nanoid } from 'nanoid';
import { groupBy } from 'ramda';

import { Input } from '@flow/content/editor/type';
import type { CustomRule } from '@c/formula-editor';

import Block, { RefType } from './block';

interface Props {
  value?: Input[];
  onChange: (value: Input[]) => void;
  customRules: CustomRule[];
}

function Send(
  { value, onChange, customRules }: Props, ref: ForwardedRef<RefType | undefined>,
): JSX.Element {
  const curRef = useRef<RefType | undefined>();
  const headerRef = useRef<RefType | undefined>();
  const bodyRef = useRef<RefType | undefined>();
  const queryRef = useRef<RefType | undefined>();
  const { header = [], body = [], query = [] } = groupBy(
    ({ in: _in }) => _in as 'header' | 'body' | 'query', value?.filter(({ in: _in }) => !!_in) || [],
  );

  useImperativeHandle(ref, () => ({
    getCurrent: () => curRef.current?.getCurrent() ?? null,
    validate: () => curRef.current?.validate(),
  }));

  function handleChange(
    id: string, key: string, val: string, type: 'header' | 'body' | 'query', index: number,
  ): void {
    const hasName = key === 'name' && val;
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

    if (index === list.length - 1 && hasName) {
      newValue.push({ type: 'string', in: type, name: '', data: '', id: nanoid() });
    }
    onChange(newValue);
  }

  function handleRemove(id: string): void {
    onChange(value?.filter(({ id: _id }) => _id !== id) ?? []);
  }

  return (
    <div className="pr-8">
      <Block
        customRules={customRules}
        ref={headerRef}
        type="header"
        value={header}
        onChange={handleChange}
        onRemove={handleRemove}
        onClick={() => curRef.current = headerRef.current}
      />
      <Block
        customRules={customRules}
        ref={bodyRef}
        type="body"
        value={body}
        onChange={handleChange}
        onRemove={handleRemove}
        onClick={() => curRef.current = bodyRef.current}
      />
      <Block
        customRules={customRules}
        ref={queryRef}
        type="query"
        value={query}
        onChange={handleChange}
        onRemove={handleRemove}
        onClick={() => curRef.current = queryRef.current}
      />
    </div>
  );
}

export default forwardRef(Send);
