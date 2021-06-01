import React, { useState } from 'react';
import { Modal, RadioGroup } from '@QCFE/lego-ui';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Button from '@c/button';
import Checkbox from '@c/checkbox';
import { getOperators } from '@c/data-filter/utils';

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
  const [filterMaps, setFilterMaps] = useState<FilterMaps>(store.filterMaps);
  const [expandList, setExpandList] = useState<string[]>([]);
  const { fieldList } = store;
  const handleCancel = () => {
    setFilterModalVisible(false);
  };

  const handleChangeField = (id: string, newData: FilterField) => {
    setFilterMaps({ ...filterMaps, [id]: newData });
  };

  const filterOptionRender = (field: PageField) => {
    return (
      <RadioGroup
        direction="column"
        disabled={!filterMaps[field.id]}
        options={getOperators(field.type, field.enum)}
        value={filterMaps[field.id]?.compareSymbol}
        onChange={(value) => handleChangeField(field.id, { compareSymbol: value })}
      />
    );
  };

  const handleRemove = (fieldID: string) => {
    const fieldMapsTmp = { ...filterMaps };
    delete fieldMapsTmp[fieldID];
    setFilterMaps(fieldMapsTmp);
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>, field: PageField) => {
    const [firstOption] = getOperators(field.type, field.enum);
    if (e.target.checked) {
      setFilterMaps({ ...filterMaps, [field.id]: { compareSymbol: firstOption.value } });
    } else {
      handleRemove(field.id);
    }
  };

  const handleExpand = (id: string) => {
    if (expandList.includes(id)) {
      setExpandList(expandList.filter((_id)=>_id !== id));
    } else {
      setExpandList([...expandList, id]);
    }
  };

  const fieldFilterRender = (field: PageField) => {
    const curFilter = filterMaps[field.id];
    const isExpand = expandList.includes(field.id);
    return (
      <div key={field.id} className='page-setting-field-filter'>
        <div className='flex items-center justify-between py-8 px-16'>
          <div
            onClick={() => handleExpand(field.id)}
            className='flex items-center flex-1 cursor-pointer'
          >
            <Icon name={isExpand ? 'expand_less' : 'expand_more'} />
            {infoRender(field.label, getFieldType(field))}
          </div>
          <Checkbox
            checked={curFilter ? true : false}
            onChange={(e) => handleCheckChange(e, field)}
          />
        </div>
        {isExpand ? (
          <div className='page-setting-filter-option'>{filterOptionRender(field)}</div>
        ) : null}
      </div>
    );
  };

  const onSave = () => {
    store.setFilterMaps(filterMaps);
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
