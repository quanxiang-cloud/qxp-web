import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import Icon from '@c/icon';
import Checkbox from '@c/checkbox';
import Modal from '@c/modal';
import { FILTER_FIELD } from '@c/data-filter/utils';

import './index.scss';

import store from '../store';

function getFieldType(field: PageField): string {
  if (field.isSystem) {
    return '系统字段';
  }

  return `控件：${field.label}`;
}

function infoRender(title: string, desc: string): JSX.Element {
  return (
    <div className='ml-8'>
      <p className='text-body2'>{title}</p>
      <p className='text-caption-no-color text-gray-400'>{desc}</p>
    </div>
  );
}

function FilterSetting(): JSX.Element {
  const [filters, setFilters] = useState<Filters>(store.filters);
  const fieldList = store.fieldList.filter(({ xComponent }) => FILTER_FIELD.includes(xComponent));

  useEffect(() => {
    if (store.filterModalVisible) {
      setFilters(store.filters);
    }
  }, [store.filterModalVisible]);

  const handleCancel = (): void => {
    store.filterModalVisible = false;
  };

  const handleRemove = (fieldID: string): void => {
    setFilters(filters.filter((id) => id !== fieldID));
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>, field: PageField): void => {
    if (e.target.checked) {
      setFilters([...filters, field.id]);
    } else {
      handleRemove(field.id);
    }
  };

  const fieldFilterRender = (field: PageField): JSX.Element => {
    return (
      <div key={field.id} className='page-setting-field-filter'>
        <div className='flex items-center justify-between py-8 px-16'>
          <div
            className='flex items-center flex-1 cursor-pointer'
          >
            {infoRender(field.label, getFieldType(field))}
          </div>
          <Checkbox
            checked={filters.includes(field.id)}
            onChange={(e) => handleCheckChange(e, field)}
          />
        </div>
      </div>
    );
  };

  const onSave = (): void => {
    store.setFilters(filters);
    store.filterModalVisible = false;
  };

  return (
    <>
      <div onClick={() => store.filterModalVisible = true} className='page-setting-filter'>
        <Icon className='mr-8' name='settings' size={20} />
        筛选条件配置
      </div>
      {store.filterModalVisible && (
        <Modal
          title="筛选条件配置"
          onClose={handleCancel}
          className="static-modal"
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: handleCancel,
            },
            {
              text: '保存筛选配置',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: onSave,
            },
          ]}
        >
          <div className='w-full px-20 py-32'>
            {fieldList.map((field: PageField) => fieldFilterRender(field))}
          </div>
        </Modal>
      )}
    </>
  );
}

export default observer(FilterSetting);
