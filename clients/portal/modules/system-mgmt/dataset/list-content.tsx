import React, { useState } from 'react';
import { observer } from 'mobx-react';

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

function ListContent(props: Props) {
  const [stagingItems, setStagingItems] = useState<Array<DatasetListItem>>([...store.dataList]);

  const addItem = (item: DatasetListItem) => {
    setStagingItems((prevItems) => [...prevItems, item]);
  };
  const removeItem = (idx: number) => {
    setStagingItems((prevItems) => {
      return prevItems.filter((v, index) => index !== idx);
    });
  };

  const handleChangeField = (idx: number, fieldKey: 'label' | 'value', val: string) => {
    setStagingItems((prevItems) => {
      return prevItems.map((v, index) => {
        if (index === idx) {
          return { ...v, [fieldKey]: val };
        }
        return v;
      });
    });
  };

  const handleSave = () => {
    // todo: validate
    if (stagingItems.some((v) => !v.label || !v.value)) {
      toast.error('label不能为空');
      return;
    }
    // const values = stagingItems.map(({ value }) => value);
    // if (values.length !== uniq(values).length) {
    //   toast.error('value不能重复');
    //   return;
    // }

    const serializeCont = JSON.stringify(stagingItems);
    if (serializeCont === JSON.stringify([...store.dataList])) {
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

  return (
    <div>
      <div className="data-list-items">
        {stagingItems.length ? (
          stagingItems.map(({ label, value }: DatasetListItem, idx: number) => {
            return (
              <div className="data-list-items--item flex items-center mb-10" key={idx}>
                <span className="inline-flex flex-1 mr-20">
                  Label: <Input type="text" size="small" value={label}
                    onChange={(e, val) => handleChangeField(idx, 'label', val)} />
                  <span style={{ display: 'none' }}>
                    Value: <Input type="text" size="small" value={value}
                      onChange={(e, val) => handleChangeField(idx, 'value', val)} />
                  </span>
                </span>
                <span className="data-list-items--item-actions">
                  <span className="cursor-pointer inline-flex items-center" onClick={() => removeItem(idx)}>
                    <Icon name="delete" />删除
                  </span>
                </span>
              </div>
            );
          })
        ) : (
          <div>暂无数据项，请添加</div>
        )}
      </div>
      <div className="flex items-center mt-20">
        <Button iconName="add" className="btn--add mr-10"
          onClick={() => addItem({ label: '', value: genId() })}>数据项</Button>
        <Button iconName="done" modifier="primary" className="btn--add" onClick={handleSave}>保存</Button>
      </div>
    </div>
  );
}

export default observer(ListContent);
