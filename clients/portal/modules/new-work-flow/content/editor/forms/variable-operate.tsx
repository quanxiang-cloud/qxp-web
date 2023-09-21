import React, { useContext, useRef, useEffect, useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useUpdateEffect } from 'react-use';
import cs from 'classnames';

import PathTree, { CurrentNode } from '@c/logic/path-tree';
import { getWebhookPathTreeValue } from '@newFlow/content/editor/forms/webhook/utils';
import useObservable from '@lib/hooks/use-observable';
import type { StoreValue } from '@newFlow/content/editor/type';
import store from '@newFlow/content/editor/store';
import { getVariableList } from '@newFlow/api';
import Loading from '@c/loading';
import Popper from '@c/popper';
import type { CustomRule } from '@c/formula-editor';

import flowSourceTable from './flow-source-table';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const modifiers = [{
  name: 'offset',
  options: { offset: [0, 4] },
}];

export default function ProcessVariableOperate({ value, onChange, btnText }: Props | any): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { tableSchema } = useContext(flowSourceTable);
  const { id: flowId = '' } = useObservable<StoreValue>(store);
  const reference = useRef<null | HTMLDivElement>(null);
  const popperRef = useRef<Popper | null>(null);
  const [customRules, setCustomRules] = useState<CustomRule[]>();

  useUpdateEffect(() => {
    popperRef.current?.close();
  }, [value]);

  useEffect(() => {
    popperRef.current && reference.current && Object.assign(popperRef.current.popperContainer.style, {
      width: `${reference.current.scrollWidth}px`,
      maxHeight: '300px',
      overflow: 'auto',
      boxShadow: '0 0 2px 0px rgba(200, 200, 200, .6)',
    });
  });

  const { data, isLoading } = useQuery('GET_VARIABLE_LIST', () => getVariableList(flowId), {
    refetchOnWindowFocus: false,
    enabled: !!flowId,
  });

  function onSelectVariable(node: CurrentNode): void {
    node.isLeaf && onChange(node.path);
    popperRef.current?.close();
  }
  const pathTreeValue = useMemo(() => getWebhookPathTreeValue(tableSchema, data), [tableSchema, data]);

  const pathTreeDom = useMemo(() => (
    <PathTree
      onChange={onSelectVariable}
      value={pathTreeValue}
      onRulesChange={setCustomRules}
    />
  ), [pathTreeValue]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  return (
    <>
      <div
        ref={reference}
        style={{ minWidth: '200px' }}
        className={cs('text-12')}
      >
        <button className="btn mt-8">{btnText}</button>
      </div>
      <Popper
        ref={popperRef}
        reference={reference}
        placement="bottom-start"
        modifiers={modifiers}
        onVisibilityChange={setIsOpen}
        className="rounded shadow-md"
      >
        {pathTreeDom}
      </Popper>

      <div className="hidden">{pathTreeDom}</div>
    </>
  );
}
