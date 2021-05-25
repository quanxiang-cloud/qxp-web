import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
// import { UnionColumns } from 'react-table';

import PopConfirm from '@c/pop-confirm';
import Table from '@c/table';

import FormRightsSettingModal from './form-rights-setting-modal';
import store from '../store';

function PageFormTable({ rightsGroupID }: { rightsGroupID: string }) {
  const [showSettingModal, setShowModal] = useState(false);
  const [curForm, setCurForm] = useState<null | PageInfo>(null);

  const handleSetting = (pageForm: PageInfo) => {
    setCurForm(pageForm);
    setShowModal(true);
  };

  const delPer = (formID: string) => {
    store.deleteFormPer(formID, rightsGroupID);
  };

  useEffect(() => {
    store.fetchPerGroupForm();
  }, []);

  const columns: any = [
    {
      Header: '工作表',
      id: 'name',
      accessor: 'name',
    },
    {
      Header: '操作权限',
      id: 'authorized',
      accessor: 'authorized',
    },
    {
      Header: '操作',
      id: 'id',
      accessor: (pageForm: PageInfo) => {
        return (
          <>
            <span onClick={() => handleSetting(pageForm)} className='text-btn'>设置</span>
            <PopConfirm content='确认清除该表单的权限吗？' onOk={() => delPer(pageForm.id)} >
              <span className='text-btn ml-16'>清除权限</span>
            </PopConfirm>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Table loading={store.perFormLoading} rowKey='id' data={store.perFormList} columns={columns} />
      {showSettingModal && curForm && (
        <FormRightsSettingModal
          pageForm={curForm}
          onCancel={() => setShowModal(false)}
          rightsGroupID={rightsGroupID}
        />
      )}
    </div>
  );
}

export default observer(PageFormTable);
