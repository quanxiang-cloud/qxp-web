import React, { useMemo, useEffect, useState, useContext } from 'react';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';
import Table from '@c/table';
import Pagination from '@c/pagination';
import PopConfirm from '@c/pop-confirm';

import DetailsDrawer from './details-drawer';
import { StoreContext } from './context';
import { operateButton } from './utils';

function PageDataTable() {
  const store = useContext(StoreContext);
  const [selected, setSelected] = useState([]);
  const [curRow, setCurRow] = useState<Record<string, any> | null>(null);

  const columns = useMemo(() => {
    if (store.tableColumns.length === 0) {
      return [];
    }

    const columnsTmp = [...store.tableColumns];
    const actionColumn = columnsTmp.pop();
    return [...columnsTmp, {
      ...actionColumn,
      accessor: (data: any) => {
        return (
          <div>
            {operateButton(1, store.authority, (
              <span
                onClick={() => setCurRow(data)}
                className='mr-16 text-blue-600 cursor-pointer'
              >
                查看
              </span>
            ))}
            {operateButton(3, store.authority, (
              <span
                onClick={() => store.goEdit(data)}
                className='mr-16 text-blue-600 cursor-pointer'
              >
                修改
              </span>
            ))}
            {operateButton(4, store.authority, (
              <PopConfirm content='确认删除该数据？' onOk={() => store.delFormData([data._id])} >
                <span className='text-red-600 cursor-pointer'>删除</span>
              </PopConfirm>
            ))}
          </div>
        );
      },
    }];
  }, [store.tableColumns]);

  useEffect(() => {
    store.fetchActionAuthorized();
    if (!store.allowRequestData) {
      return;
    }
    store.setParams({});
  }, [store.pageID]);

  const handleSelectChange = (selectArr: any) => {
    setSelected(selectArr);
  };

  const textBtnRender = (text: string, icon: string, onClick: () => void) => {
    return (
      <div
        onClick={onClick}
        className='inline-flex items-center cursor-pointer hover:text-blue-600'
      >
        <Icon size={20} className='mr-4 app-icon-color-inherit' name={icon} />
        {text}
      </div>
    );
  };

  return (
    <div className='form-app-data-table-container flex flex-col flex-1'>
      <div className='mb-16 flex items-center gap-x-16'>
        {operateButton(2, store.authority, (
          <Button onClick={store.createFun} modifier='primary' iconName='add'>新建</Button>
        ))}
        {operateButton(4, store.authority, (
          selected.length > 0 && textBtnRender('批量删除',
            'restore_from_trash',
            () => store.delFormData(selected)
          )
        ))}
        {/* {textBtnRender('导入', 'file_download')}
        {textBtnRender('导出', 'file_upload')} */}
      </div>
      <Table
        showCheckbox
        emptyTips='暂无数据'
        rowKey="_id"
        loading={store.listLoading}
        onSelectChange={handleSelectChange}
        columns={columns}
        data={store.formDataList}
      />
      {store.tableConfig.pageSize ? (
        <Pagination
          current={store.params.page}
          total={store.total}
          pageSize={store.params.size}
          onChange={(page: number, size: number) => {
            store.setParams({ page, size });
          }}
        />
      ) : null}
      {curRow ? <DetailsDrawer rowID={curRow?._id} onCancel={() => setCurRow(null)} /> : null}
    </div>
  );
}

export default observer(PageDataTable);
