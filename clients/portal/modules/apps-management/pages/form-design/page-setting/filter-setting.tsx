import React, { useState, useEffect } from 'react';
import { Modal, RadioGroup } from '@QCFE/lego-ui';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Button from '@c/button';
import Checkbox from '@c/checkbox';

import './index.scss';
import store from '../store';

function getFieldType(field: PageField) {
  if (field.isSystem) {
    return '系统字段';
  }

  return `控件：${field.label}`;
}

function infoRender(title: string, desc: string) {
  return (
    <div className='ml-8'>
      <p className='text-body2'>{title}</p>
      <p className='text-caption-no-color text-gray-400'>{desc}</p>
    </div>
  );
}

function FilterSetting() {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [fieldList, setFieldList] = useState<PageField[]>([]);

  useEffect(() => {
    if (!filterModalVisible) {
      return;
    }

    setFieldList(
      store.fieldList.map((field) => {
        const filterField = store.allFiltrate.find(({ id }) => {
          return id === field.id;
        });
        if (filterField) {
          return filterField;
        }

        return field;
      })
    );
  }, [store.fieldList, filterModalVisible]);

  const handleCancel = () => {
    setFilterModalVisible(false);
  };

  const handleChangeField = (id: string, newData: any) => {
    setFieldList(
      fieldList.map((field) => {
        if (field.id === id) {
          return { ...field, ...newData };
        }
        return field;
      })
    );
  };

  const filterOptionRender = (field: PageField) => {
    switch (field.type) {
    case 'datetime':
      return (
        <Checkbox
          disabled={!field.filter}
          checked={field.option?.range ? true : false}
          onChange={(e) => handleChangeField(field.id, { option: { range: e.target.checked } })}
          label={infoRender('日期范围查询', '可选值来自字段配置填写的内容')}
        />
      );
    case 'number':
      return (
        <RadioGroup
          direction="column"
          disabled={!field.filter}
          options={[
            {
              label: '大于',
              value: 'gt',
            },
            {
              label: '小于',
              value: 'lt',
            },
            {
              label: '等于',
              value: 'eq',
            },
          ]}
          value={field.option?.compareSymbol}
          onChange={(value) => handleChangeField(field.id, { option: { compareSymbol: value } })}
        />
      );
    }
  };

  const fieldFilterRender = (field: PageField) => {
    return (
      <div key={field.id} className='page-setting-field-filter'>
        <div className='flex items-center justify-between py-8 px-16'>
          {['datetime', 'number'].includes(field.type) ? (
            <div
              onClick={() => handleChangeField(field.id, { expand: !field.expand })}
              className='flex items-center flex-1 cursor-pointer'
            >
              <Icon name={field.expand ? 'expand_less' : 'expand_more'} />
              {infoRender(field.label, getFieldType(field))}
            </div>
          ) : (
            <div className='flex items-center flex-1'>
              {infoRender(field.label, getFieldType(field))}
            </div>
          )}
          <Checkbox
            checked={field.filter ? true : false}
            onChange={(e) => {
              handleChangeField(field.id,
                e.target.checked ? { filter: true, option: { compareSymbol: '>' } } :
                  { filter: false, option: {} }
              );
            }}
          />
        </div>
        {field.expand ? (
          <div className='page-setting-filter-option'>{filterOptionRender(field)}</div>
        ) : null}
      </div>
    );
  };

  const onSave = () => {
    const filterList = fieldList.filter(({ filter }: PageField) => filter);
    store.setFilterList(filterList);
    setFilterModalVisible(false);
  };

  return (
    <>
      <div onClick={() => setFilterModalVisible(true)} className='page-setting-filter'>
        <Icon className='mr-8' name='settings' size={20} />
        筛选条件配置
      </div>
      {filterModalVisible && (
        <Modal
          visible
          title='筛选条件配置'
          onCancel={handleCancel}
          className="static-modal"
          footer={
            (<div className="flex items-center">
              <Button iconName='close' onClick={handleCancel}>
                取消
              </Button>
              <div className="px-2"></div>
              <Button
                onClick={onSave}
                modifier='primary'
                iconName='check'
              >
                保存筛选配置
              </Button>
            </div>)
          }
        >
          <div className='w-full'>
            {fieldList.map((field: PageField) => fieldFilterRender(field))}
          </div>
        </Modal>
      )}
    </>
  );
}

export default observer(FilterSetting);
