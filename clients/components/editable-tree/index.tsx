import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { toJS } from 'mobx';
import { get, set, cloneDeep } from 'lodash';

import Button from '@c/button';
import Icon from '@c/icon';
import toast from '@lib/toast';
import { generateRandomFormFieldID as genId } from '@c/form-builder/utils';

import './index.scss';

interface Props {
  className?: string;
  initialValue?: OptionSetTreeItem[];
  onSave: (dataset: OptionSetTreeItem[]) => void;
  hideSaveBtn?: boolean;
}

export type RefType = { getValues: ()=> (OptionSetTreeItem[] | undefined) };

function TreeContent({
  initialValue = [],
  onSave,
  hideSaveBtn,
  className,
}: Props, ref: React.Ref<RefType>): JSX.Element {
  const [tree, setTree] = useState<OptionSetTreeItem[]>(initialValue);
  const treeRef: React.MutableRefObject<any> = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return {
      getValues: () => {
        return validate() ? tree : undefined;
      },
    };
  });

  function handleAddSubNode(nodePath: string): void {
    const bakTree = cloneDeep(toJS(tree));
    const path = `${nodePath}.children`;
    let cur = get(bakTree, path);
    if (!cur) {
      set(bakTree, path, []);
      cur = get(bakTree, path);
    }
    cur.push({ label: '', value: genId() });

    setTree(bakTree);
  }

  function handleRemoveItem(path: string): void {
    const bakTree = cloneDeep(tree);
    const bracketIdx = path.lastIndexOf('[');
    const lastIdx = parseInt(path.slice(bracketIdx + 1));
    const parentPath = path.slice(0, bracketIdx);
    const parent = parentPath ? get(bakTree, parentPath) : bakTree;
    // remove chosen item
    parent.splice(lastIdx, 1);
    setTree(bakTree);
  }

  function handleChangeField(path: string, fieldKey: 'label' | 'value', val: string): void {
    const bakTree = cloneDeep(tree);
    set(bakTree, path ? [path, fieldKey].join('.') : fieldKey, val);
    setTree(bakTree);
  }

  function validate(): boolean {
    // validate
    // 1.label must filled
    let valid = true;
    const checkItem = ({ label, value, children }: OptionSetTreeItem): void => {
      if (!label || !value) {
        valid = false;
        return;
      }
      if (children?.length) {
        children.forEach(checkItem);
      }
    };
    tree.forEach(checkItem);

    if (!valid) {
      toast.error('label不能为空');
      return false;
    }
    return true;
  }

  const handleSave = (): void => {
    if (validate()) {
      onSave(tree);
    }
  };

  function getNodePath(prefix: string, idx: number): string {
    /*
      level-0: path=[1]
      level-1: path=[0].children[1]
      level-2: path=[0].children[1].children[2]
     */
    if (!prefix) {
      return `[${idx}]`;
    }
    return `${prefix}.children[${idx}]`;
  }

  function getLevelFromPrefix(prefix: string): number {
    if (prefix === '') {
      return 0;
    }
    return prefix.split('.').length;
  }

  function renderTree({
    label, value, children = [],
  }: OptionSetTreeItem, prefix = '', idx: number): JSX.Element {
    const level = getLevelFromPrefix(prefix);
    const nodePath = getNodePath(prefix, idx);

    return (
      <div
        key={[nodePath, idx].join('--')}
        className="data-tree-items--item mb-10"
        style={{ transform: `translateX(${level * 10}px)` }}
        data-path={nodePath}
        data-idx={idx}
      >
        <div className="flex items-center tree-row-item">
          <span className="inline-flex flex-1 flex-grow-0 mr-20">
            -
            <input
              type="text"
              className="input"
              value={label}
              onChange={(ev) => handleChangeField(nodePath, 'label', ev.currentTarget.value)}
            />
            <span style={{ display: 'none' }}>Value: <input type="text" defaultValue={value} /></span>
          </span>
          <span className="data-tree-items--item-actions flex">
            <span
              className="cursor-pointer flex items-center mr-10 hover:bg-gray-100"
              onClick={() => handleAddSubNode(nodePath)}
              title="子节点"
            >
              <Icon name="add" />
            </span>
            <span
              className="cursor-pointer flex items-center hover:bg-gray-100"
              onClick={() => handleRemoveItem(nodePath)}
              title="删除"
            >
              <Icon name="delete" />
            </span>
            {children.length > 0 && (
              <span
                className="cursor-pointer flex items-center hover:bg-gray-100 ml-10"
                onClick={(ev) => {
                  const span = ev.currentTarget;
                  // const elemItems = span.closest('.data-tree-items--items') as HTMLDivElement;
                  const elemItems = span?.parentElement?.parentElement?.nextSibling as HTMLDivElement;
                  if (elemItems) {
                    const prevDisplay = elemItems.style.display;
                    elemItems.style.display = prevDisplay === 'none' ? 'block' : 'none';
                    span.querySelector('svg')?.classList.toggle('icon-expand');
                  }
                }}>
                <Icon name="expand_more" />
              </span>
            )}
          </span>
        </div>
        {renderItems(children, nodePath)}
      </div>
    );
  }

  function renderItems(items: OptionSetTreeItem[], prefix = ''): JSX.Element | null {
    if (!items || !items.length) {
      return null;
    }
    return (
      <div className="data-tree-items--items mt-10">
        {items.map((item: OptionSetTreeItem, idx) => renderTree(item, prefix, idx))}
      </div>
    );
  }

  return (
    <div className={className} ref={treeRef}>
      <div className="data-tree-items">
        {tree.length ?
          tree.map((item: OptionSetTreeItem, idx) => renderTree(item, '', idx)) :
          <div>暂无数据项，请添加</div>
        }
      </div>
      <div className="flex items-center mt-20">
        <Button
          iconName="add"
          className="btn--add mr-10"
          onClick={() => setTree((prevTree) => [...prevTree, { label: '', value: genId() }])}
        >
          数据项
        </Button>
        {!hideSaveBtn &&
        <Button iconName="done" modifier="primary" className="btn--add" onClick={handleSave}>保存</Button>}
      </div>
    </div>
  );
}

export default forwardRef(TreeContent);
