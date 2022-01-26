import React, { useContext, useRef, useEffect, useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useUpdateEffect } from 'react-use';
import { pipe, find, propEq, propOr } from 'ramda';
import cs from 'classnames';

import PathTree, { CurrentNode } from '@c/logic/path-tree';
import { getWebhookPathTreeValue } from '@flow/content/editor/forms/webhook/utils';
import useObservable from '@lib/hooks/use-observable';
import type { StoreValue } from '@flow/content/editor/type';
import store from '@flow/content/editor/store';
import { getVariableList } from '@flow/api';
import Loading from '@c/loading';
import Popper from '@c/popper';
import Icon from '@c/icon';
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

export default function ProcessVariableSelector({ value, onChange }: Props): JSX.Element {
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
  }

  const pathTreeValue = useMemo(() => getWebhookPathTreeValue(tableSchema, data), [tableSchema, data]);
  const arrowStyle: React.CSSProperties = isOpen ? { transform: 'rotate(180deg)' } : {};

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

  const getLabelByValue = pipe<Array<CustomRule[]>, CustomRule | undefined, string>(
    find<CustomRule>(propEq('key', value)),
    propOr('', 'name'),
  );

  return (
    <>
      <div
        ref={reference}
        style={{ minWidth: '200px' }}
        className={cs('dropdown-trigger text-12', { 'border-blue-600': isOpen })}
      >
        <div className="select-trigger__content flex gap-4">
          <span className="text-caption">{getLabelByValue(customRules ?? []) ?? '请选择'}</span>
        </div>
        <Icon name="keyboard_arrow_down" style={arrowStyle} className="trigger-arrow-icon" />
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
