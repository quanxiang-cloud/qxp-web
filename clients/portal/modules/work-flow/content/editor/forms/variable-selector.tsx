import React, { useContext, useRef, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useUpdateEffect } from 'react-use';
import cs from 'classnames';

import FormulaTree from '@polyApi/components/poly-node-path-tree';
import { webhookPathTreeSourceGetter } from '@flow/content/editor/forms/webhook/utils';
import useObservable from '@lib/hooks/use-observable';
import type { StoreValue } from '@flow/content/editor/type';
import store from '@flow/content/editor/store';
import { getVariableList } from '@flow/api';
import Loading from '@c/loading';
import Popper from '@c/popper';
import Icon from '@c/icon';

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

  useUpdateEffect(() => {
    popperRef.current?.close();
  }, [value]);

  useEffect(() => {
    if (popperRef.current && reference.current) {
      popperRef.current.popperContainer.style.width = `${reference.current.scrollWidth}px`;
      popperRef.current.popperContainer.style.maxHeight = '300px';
      popperRef.current.popperContainer.style.overflow = 'auto';
      popperRef.current.popperContainer.style.boxShadow = '0 0 2px 0px rgba(200, 200, 200, .6)';
    }
  });

  const { data, isLoading } = useQuery('GET_VARIABLE_LIST', () => getVariableList(flowId), {
    refetchOnWindowFocus: false,
    enabled: !!flowId,
  });

  function handleTreeNodeClick(node: any): void {
    node.isLeaf && onChange(node.path);
  }

  const sourceGetter = webhookPathTreeSourceGetter(tableSchema, data);
  const arrowStyle: React.CSSProperties = isOpen ? { transform: 'rotate(180deg)' } : {};

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  return (
    <>
      <div
        ref={reference}
        style={{ minWidth: '200px' }}
        className={cs('dropdown-trigger text-12', { 'border-blue-600': isOpen })}
      >
        <div className="select-trigger__content flex gap-4">
          <span className="text-caption">{value || '请选择'}</span>
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
        <FormulaTree
          hasSuffix
          onSelect={handleTreeNodeClick}
          sourceGetter={sourceGetter}
        />
      </Popper>
    </>
  );
}
