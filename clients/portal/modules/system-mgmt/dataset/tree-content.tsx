import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { get, set, cloneDeep, has, each } from 'lodash';

import { Input } from '@QCFE/lego-ui';
import Button from '@c/button';
import Icon from '@c/icon';
import toast from '@lib/toast';
import { generateRandomFormFieldID as genId } from '@c/form-builder/utils';

import store from './store';
import { updateDataset } from './api';

interface Props {
  className?: string;
}

const _root = 'ROOT';

const origCont = JSON.stringify({ ...store.dataList });

function TreeContent(props: Props) {
  const [tree, setTree] = useState<DatasetTreeItem>({ ...store.dataList });

  const addSubNode = (prefix = '', idx: number) => {
    const level = getLevelFromPrefix(prefix);
    const nodePath = getNodePath(prefix, idx);
    // if (level > 2) {
    //   toast.error('最多创建三层的tree');
    //   return;
    // }

    console.log('add sub node: ', ',nodePath: ', nodePath, ',level: ', level, ', idx: ', idx);
    let bakTree = cloneDeep(toJS(tree));

    if (level === 0 && !has(bakTree, 'items')) {
      bakTree = { label: '', value: genId(), items: [] };
    }

    const path = nodePath ? `${nodePath}.items` : 'items';
    let cur = get(bakTree, path);
    if (!cur) {
      cur = set(bakTree, path, []);
    }
    cur.push({ label: '', value: genId(), items: [] });

    console.log('cur tree: ', bakTree);

    setTree(bakTree);
  };

  const removeItem = (path: string) => {
    let bakTree = cloneDeep(tree);
    if (!path) {
      // @ts-ignore empty whole tree
      bakTree = {};
    } else {
      const bracketIdx = path.lastIndexOf('[');
      const lastIdx = parseInt(path.slice(bracketIdx + 1));
      const parentPath = path.slice(0, bracketIdx);
      const parent = get(bakTree, parentPath);
      // remove chosen item
      parent.splice(lastIdx, 1);
    }
    setTree(bakTree);
  };

  const handleChangeField = (path: string, fieldKey: 'label' | 'value', val: string) => {
    const bakTree = cloneDeep(tree);
    set(bakTree, path ? [path, fieldKey].join('.') : fieldKey, val);
    setTree(bakTree);
  };

  const handleSave = () => {
    // validate
    // 1.label must filled
    let valid = true;
    const checkItem = ({ label, value, items }: DatasetTreeItem) => {
      if (!label || !value) {
        valid = false;
        return;
      }
      if (items.length) {
        each(items, (v: DatasetTreeItem) => {
          checkItem(v);
        });
      }
    };
    checkItem(tree);

    if (!valid) {
      toast.error('label和value 不能为空');
      return;
    }

    const serializeCont = JSON.stringify(tree);
    if (serializeCont === origCont) {
      toast.error('数据未更改');
      return;
    }

    // @ts-ignore
    updateDataset({
      ...store.activeDataset,
      content: serializeCont,
    }).then((data) => {
      if (data) {
        toast.success('更新成功');
        // @ts-ignore
        // update current content
        store.activeDataset.content = serializeCont;
      } else {
        toast.error('更新失败');
      }
    }).catch((err: Error) => toast.error(err.message));
  };

  const getNodePath = (prefix: string, idx: number) => {
    const level = getLevelFromPrefix(prefix);
    /*
      level-0: path=''
      level-1: path='items[0]'
      level-2: path=items[0].items[1]
     */
    if (level === 0) {
      return '';
    }
    if (level === 1) {
      return `items[${idx}]`;
    }
    return `${prefix}.items[${idx}]`;
  };

  const getLevelFromPrefix = (prefix: string) => {
    if (prefix === _root) {
      return 0;
    }
    if (prefix === '') {
      return 1;
    }
    return prefix.split('.').length + 1;
  };

  const renderTree = ({ label, value, items }: DatasetTreeItem, prefix = '', idx: number) => {
    const level = getLevelFromPrefix(prefix);
    const nodePath = getNodePath(prefix, idx);

    return (
      <div className="data-tree-items--item mb-10" key={[nodePath, idx].join('--')} data-path={nodePath} data-idx={idx}
        style={{
          transform: `translateX(${level * 10}px)`,
        }}>
        <div className="flex items-center tree-row-item">
          <span className="inline-flex flex-1 flex-grow-0 mr-20">
                  Label: <Input type="text" size="small" value={label}
              onChange={(e, val) => handleChangeField(nodePath, 'label', val)} className="mr-10" />
                  Value: <Input type="text" size="small" value={value}
              onChange={(e, val) => handleChangeField(nodePath, 'value', val)} />
          </span>
          <span className="data-tree-items--item-actions flex">
            <span className="cursor-pointer flex items-center mr-10"
              onClick={() => addSubNode(prefix, idx)}>
              <Icon name="add" /><span>子节点</span>
            </span>
            <span className="cursor-pointer flex items-center" onClick={() => removeItem(nodePath)}>
              <Icon name="delete" className="cursor-pointer" /><span>删除</span>
            </span>
          </span>
        </div>
        {renderItems(items, nodePath)}
      </div>
    );
  };

  const renderItems = (items: DatasetTreeItem[], prefix = '') => {
    if (!items || !items.length) {
      return null;
    }
    return (
      <div className="data-tree-items--items mt-10">
        {items.map((item: DatasetTreeItem, idx) => renderTree(item, prefix, idx))}
      </div>
    );
  };

  return (
    <div>
      <div className="data-tree-items">
        {tree.items ? renderTree(tree, _root, 0) : <div>暂无数据项，请添加</div>}
      </div>
      <div className="flex items-center mt-20">
        <Button forbidden={!!tree.items} iconName="add" className="btn--add mr-10"
          onClick={() => setTree({ label: '', value: genId(), items: [] })}>数据项</Button>
        <Button iconName="done" modifier="primary" className="btn--add" onClick={handleSave}>保存</Button>
      </div>
    </div>
  );
}

export default observer(TreeContent);
