import React, { useState } from 'react';
import { Modal } from '@QCFE/lego-ui';

import Icon from '@c/icon';
import Button from '@c/button';

import './index.scss';

function FilterSetting() {
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const handleCancel = () => {
    setFilterModalVisible(false);
  };

  const fieldFilterRender = (field:any) => {
    return (
      <div className='flex items-center'>
        <Icon name='expand_more' />
        <div className='flex-1'>
          <p className='text-body2'>{field.label}</p>
          <p className='text-caption-no-color'>系统字段</p>
        </div>
      </div>
    );
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
                modifier='primary'
                iconName='check'
              >
                保存筛选配置
              </Button>
            </div>)
          }
        >
          1111
        </Modal>
      )}
    </>
  );
}

export default FilterSetting;
