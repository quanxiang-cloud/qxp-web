import React, { useEffect, useContext, useState } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Table, { SizeType } from '@c/table';
import Icon from '@c/icon';
import Pagination from '@c/pagination';
import PopConfirm from '@c/pop-confirm';
import MoreMenu from '@c/more-menu';

import TableConfig from './table-config';
import AdvancedQuery from './advanced-query';
import { StoreContext } from './context';

const TABLE_SIZE_MENUS: (LabelValue & { key: SizeType })[] = [
  { label: '正常', value: 'middle', key: 'middle' },
  { label: '紧凑', value: 'small', key: 'small' },
];

function PageDataTable(): JSX.Element {
  const [tableSize, setTableSize] = useState<SizeType>('middle');
  const store = useContext(StoreContext);
  const { selected, setSelected } = store;

  useEffect(() => {
    if (!store.allowRequestData) {
      return;
    }

    store.setParams({});
  }, [store.pageID]);

  const handleSelectChange = (selectArr: string[], rows: Record<string, any>[]): void => {
    setSelected(selectArr, rows);
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
        <div className='flex gap-x-5 items-center'>
          <TableConfig />
          <MoreMenu onMenuClick={setTableSize} menus={TABLE_SIZE_MENUS} activeMenu={tableSize}>
            <Icon clickable changeable size={25} name='expand' />
          </MoreMenu>
          <AdvancedQuery
            tag={store.params.tag}
            fields={store.fields}
            search={store.setParams}
          />
        </div>
      </div>
      <div className='flex flex-1 overflow-hidden'>
        <Table
          canSetColumnWidth={store.canSetColumnWidth}
          showCheckbox={store.showCheckbox}
          emptyTips='暂无数据'
          size={tableSize}
          rowKey="_id"
          loading={store.listLoading}
          initialSelectedRowKeys={selected || []}
          canAcrossPageChoose={store.canAcrossPageChoose}
          onSelectChange={handleSelectChange}
          columns={store.tableShowColumns}
          data={toJS(store.formDataList)}
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
