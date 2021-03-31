import React, { useState, useEffect, useRef } from 'react';
import useClickAway from 'react-use/lib/useClickAway';
import { Icon, Field, Control, Label, Form } from '@QCFE/lego-ui';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import Store from '@c/headless-tree/store';
import { TreeNode } from '@c/headless-tree/types';
import Tree from '@c/headless-tree';
import Loading from '@c/loading2';

import NodeRender from './tree-node';

export type Props<T> = {
  label?: string;
  treeData?: TreeNode<T>;
  onChange?: (id: string, paths: T[]) => void;
  isOpen?: boolean;
  labelKey?: string;
  name?: string;
  defaultValue?: string;
  closeOnSelect?: boolean;
  required?: boolean;
  help?: string;
  toggleable?: boolean;
}

function TreePicker<T extends { id: string; }>({
  treeData,
  onChange,
  label,
  isOpen = true,
  labelKey = 'name',
  name = 'treePicker',
  defaultValue = '',
  closeOnSelect,
  required,
  help = '请选择项目',
  toggleable = true,
}: Props<T>): JSX.Element {
  const [path, setPath] = useState<T[]>([]);
  const [open, setOpen] = useState<boolean>(isOpen);
  const [store, setStore] = useState<Store<T>>();
  const [value, setValue] = useState<string>(defaultValue);
  const isFirstLoadRef = useRef<boolean>(true);
  const domRef = useRef<any>(null);

  function toggle() {
    toggleable && setOpen((o) => !o);
  }

  useClickAway(domRef, () => setOpen(false));

  useEffect(() => {
    if (!store || !defaultValue) {
      return;
    }
    const node = store.nodeList.find((node) => node.id === defaultValue);
    if (node) {
      const path = [node.data, ...store.getNodeParents(node.id).map(({ data }) => data)];
      setPath(path);
      setValue(node.id);
      store.onSelectNode(node.id);
      onChange && onChange(node.id, path);
    }
  }, [defaultValue, store]);

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
  const text = path.map((p) => (p as any)[labelKey]).reverse().join(' > ');
  const schemas = [];
  if (required) {
    schemas.push({
      help: help,
      status: 'error',
      rule: { required: true },
    });
  }

  return (
    <div
      className="flex flex-col items-center w-full"
      ref={domRef}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        className="w-full cursor-pointer"
        title={text}
      >
        <Field className="flex flex-col">
          <Label>{label}</Label>
          <Control className="w-full self-stretch relative">
            <Form.TextAreaField
              name={`${name}Value`}
              className="cursor-pointer text-area-input flex flex-col"
              value={text}
              schemas={schemas}
            />
            <Form.TextField name={name} value={value} className="hidden h-0" />
            {toggleable && (
              <Icon
                name="chevron-down"
                size="20"
                className={
                  twCascade(
                    'transition-all absolute cursor-pointer top-16 transform',
                    {
                      '-rotate-180': open,
                    }
                  )
                }
                style={{
                  right: '0.6rem',
                }}
              />
            )}
          </Control>
        </Field>
      </div>
      <Tree
        store={store}
        NodeRender={NodeRender}
        RootNodeRender={NodeRender}
        className={
          twCascade('transition-all border border-blue-1000 border-t-0 mb-10 overflow-scroll', {
            'h-0': !open,
            'h-280': open,
            invisible: !open,
            visible: open,
          })
        }
        onSelect={(node) => {
          if (isFirstLoadRef.current) {
            isFirstLoadRef.current = false;
            return;
          }
          const path = [node, ...store.getNodeParents(node.id).map(({ data }) => data)];
          setPath(path);
          setValue(node.id);
          onChange && onChange(node.id, path);
          if (closeOnSelect) {
            toggle();
          }
        }}
      />
    </div>
  );
}

export default TreePicker;
