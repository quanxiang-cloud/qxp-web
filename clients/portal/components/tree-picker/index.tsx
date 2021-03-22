import React, { useState, useEffect } from 'react';
import { Icon, Field, Control, Label, Form, Input } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import Store from '@portal/components/headless-tree/store';
import { TreeNode } from '@portal/components/headless-tree/types';
import Tree from '@portal/components/headless-tree';
import { Loading } from '@portal/components/loading2';
import NodeRender from './tree-node';

export type TreePickerType<T> = {
  label?: string;
  treeData?: TreeNode<T>;
  onChange?: (id: string, paths: T[]) => void;
  isOpen?: boolean;
  labelKey?: string;
  name?: string;
  defaultValue?: string;
}

function TreePicker<T extends { id: string; }>({
  treeData,
  onChange,
  label,
  isOpen = false,
  labelKey = 'name',
  name = 'treePicker',
  defaultValue = '',
}: TreePickerType<T>): JSX.Element {
  const [path, setPath] = useState<T[]>([]);
  const [open, setOpen] = useState<boolean>(isOpen);
  const [store, setStore] = useState<Store<T>>();
  const [value, setValue] = useState<string>(defaultValue);

  console.log(treeData, value, defaultValue);

  useEffect(() => {
    setValue(defaultValue);
    store?.onSelectNode(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (treeData) {
      setStore(new Store({ rootNode: treeData }));
    }
  }, [treeData]);

  if (!store) {
    return <Loading desc="加载中..." />;
  }

  const text = path.reverse().map((p) => (p as any)[labelKey]).join(' > ');

  return (
    <div className="flex flex-col items-center w-full">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="w-full cursor-pointer"
        title={text}
      >
        <Field className="flex flex-col">
          <Label>{label}</Label>
          <Control className="w-full self-stretch relative">
            <Form.TextAreaField
              name={`${name}Value`}
              className="cursor-pointer text-area-input"
              value={text}
            />
            <Form.TextField name={name} value={value} className="hidden h-0" />
            <Icon
              name="chevron-down"
              size="20"
              className={
                twCascade(
                  'transition-all absolute top-2/4 transform -translate-y-2/4 cursor-pointer',
                  {
                    '-rotate-180': open,
                  }
                )
              }
              style={{
                right: '0.6rem',
              }}
            />
          </Control>
        </Field>
      </div>
      <Tree
        store={store}
        NodeRender={NodeRender}
        RootNodeRender={NodeRender}
        className={
          twCascade('transition-all border border-blue-1000 border-t-0 overflow-scroll mb-10', {
            'h-0': !open,
            'h-96': open,
            invisible: !open,
            visible: open,
          })
        }
        onSelect={(node) => {
          const path = [node, ...store.getNodeParents(node.id).map(({ data }) => data)];
          setPath(path);
          setValue(node.id);
          onChange && onChange(node.id, path);
        }}
      />
    </div>
  );
}

export default TreePicker;
