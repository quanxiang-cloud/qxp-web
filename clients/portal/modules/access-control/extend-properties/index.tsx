import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Modal from '@c/modal';
import TextHeader from '@c/text-header';

import PropertiesTable from './properties-table';
import PropertiesForm from './properties-form';
import store from './store';

import '../index.scss';
import Search from '@c/search';

function ExtendProperties(): JSX.Element {
  useEffect(() => {
    store.loading = true;
    store.fetchCloum();
  }, []);

  return (
    <div>
      <TextHeader
        title='扩展属性'
        className="bg-gray-1000 px-20 header-background-image border-b-1"
        itemTitleClassName="text-h5"
      />
      <div className='m-16'>
        <div className='mb-8 flex items-center justify-between'>
          <Button
            modifier='primary'
            iconName='add'
            onClick={() => store.handleAdd()}
          >
            新建属性
          </Button>
          <Search
            className='w-220 text-12'
            placeholder='搜索名称...'
            value={store.search}
            onChange={(val) => {
              store.filterType === 'all' ? '' : store.filterType = 'all';
              store.setSearch(val);
            }}
          />
        </div>
        <PropertiesTable />
        {store.isVisible && (
          <Modal
            title={store.isEdit ? '修改扩展属性' : '添加扩展属性'}
            className='extend-properties-modal'
            onClose={() => store.setIsVisible(false)}
          >
            <PropertiesForm />
          </Modal>
        )}
      </div>
    </div>
  );
}

export default observer(ExtendProperties);
