
import React, { useState } from 'react';
import Modal from '@c/modal';
import FormDataTable from '@c/form-app-data-table';
import useTableViewStore from '@home/pages/app-table-view-detail/use-table-view-store';
import DetailsDrawer from '@home/pages/app-table-view-detail/details-drawer';

function AssociatedTableModal(props: any): JSX.Element {
  const {
    title,
    onClose,
    componentProps,
    filterConfig,
  } = props;
  const { appID, tableID } = componentProps;
  const store = useTableViewStore({
    appID, tableID,
    name: '',
  });
  const [showDrawer, setShowDrawer] = useState(false);
  const [rowDataID, setRowDataID] = useState<any>();

  function goView(rowID: string): void {
    setShowDrawer(true);
    setRowDataID(rowID);
  }

  const customColumns = [{
    id: 'action',
    Header: '操作',
    fixed: true,
    accessor: (rowData: any) => {
      return (
        <div>
          <span
            onClick={() => {
              store.operationType = '查看';
              goView(rowData._id);
            }}
            className='mr-16 text-blue-600 cursor-pointer'
          >
              查看
          </span>
        </div>

      );
    },
  }];

  const handleDrawerCancel = ()=>{
    setShowDrawer(false);
  };

  return (
    <>
      <Modal
        title={title || '数据新增'}
        onClose={onClose}
      >
        <div className="p-20">
          <FormDataTable
            allowRequestData
            showCheckbox={false}
            pageID={tableID}
            appID={appID}
            filterConfig={filterConfig}
            // customColumns={customColumns}
          />
        </div>
        { showDrawer && (
          <DetailsDrawer
            rowID={rowDataID}
            appID={appID}
            tableID={tableID}
            authority={store.authority}
            onCancel={handleDrawerCancel}
          />
        )}
      </Modal>

    </>

  );
}

export default AssociatedTableModal;
