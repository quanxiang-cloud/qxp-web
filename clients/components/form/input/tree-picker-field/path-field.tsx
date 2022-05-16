import React, { MouseEventHandler, Ref, useMemo, useEffect, useState } from 'react';
import { Input } from 'antd';
import cs from 'classnames';

import { TreeNode } from '@c/headless-tree/types';
import Store from '@c/headless-tree/store';

interface Props<T> {
  treeData?: TreeNode<T>;
  value: string;
  labelKey?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onClear?: () => void;
  appendix?: JSX.Element | null;
}

function PathField<T extends { id: string}>({
  treeData,
  value,
  labelKey = 'name',
  appendix,
  onClick,
}: Props<T>, ref: Ref<HTMLDivElement>): JSX.Element {
  const [store, setStore] = useState<Store<T>>();

  useEffect(() => {
    if (treeData) {
      const newStore = new Store({ rootNode: treeData }, false);
      setStore(newStore);
    }
  }, [treeData]);

  const path = useMemo(() => {
    const node = store?.getNode(value)?.data;
    if (!node) return '';

    const pathNode = [node, ...store.getNodeParents(node.id).map(({ data }) => data)];
    return pathNode.map((p) => (p as any)[labelKey]).reverse().join(' > ');
  }, [store, value]);
  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={cs('w-full cursor-pointer relative')}
      title={path}
    >
      <div title={path}>
        <Input
          className="text-area-input flex flex-col"
          value={path}
        />
      </div>
      <Input value={value} className="hidden h-0" />

      {(appendix && (<>{appendix}</>))}
    </div>
  );
}

export default React.forwardRef(PathField);
