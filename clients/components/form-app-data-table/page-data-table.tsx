import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Table from '@c/table';
import Pagination from '@c/pagination';
import PopConfirm from '@c/pop-confirm';

import AdvancedQuery from './advanced-query';
import { StoreContext } from './context';

function PageDataTable(): JSX.Element {
  const store = useContext(StoreContext);
  const { selected, setSelected } = store;

  useEffect(() => {
    if (!store.allowRequestData) {
      return;
    }
    store.setParams({});
  }, [store.pageID]);

  const handleSelectChange = (selectArr: string[]): void => {
    setSelected(selectArr);
  };

  return (
    <div className='form-app-data-table-container flex flex-col'>
      <div className='flex justify-between'>
        <div className='mb-16 flex items-center gap-x-16'>
          {store.tableHeaderBtnList.map(({ key, text, action, type, popText, iconName, isBatch }) => {
            if (type === 'popConfirm') {
              return (
                <PopConfirm key={key} content={popText} onOk={() => action(selected)} >
                  <Button
                    forbidden={isBatch && selected.length === 0 ? true : false}
                    iconName={iconName}
                    modifier='primary'
                  >
                    {text}
                  </Button>
                </PopConfirm>
              );
            }
            return (
              <Button
                iconName={iconName}
                forbidden={isBatch && selected.length === 0 ? true : false}
                modifier='primary'
                key={key}
                onClick={() => action(selected)}
              >
                {text}
              </Button>
            );
          })}

        </div>
        <AdvancedQuery
          tag={store.params.tag as 'or' | 'and'}
          fields={store.fields}
          search={store.setParams}
        />
      </div>
      <div className='flex flex-1 overflow-hidden'>
        <Table
          showCheckbox={store.showCheckbox}
          emptyTips='暂无数据'
          rowKey="_id"
          loading={store.listLoading}
          onSelectChange={handleSelectChange}
          columns={store.tableColumns}
          data={store.formDataList}
        />
      </div>
      <Pagination
        current={store.params.page as number}
        total={store.total}
        pageSize={store.params.size as number}
        onChange={(page: number, size: number) => {
          store.setParams({ page, size });
        }}
      />
    </div>
  );
}

export default observer(PageDataTable);
