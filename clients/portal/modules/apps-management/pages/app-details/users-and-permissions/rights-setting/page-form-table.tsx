import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { UnionColumns } from 'react-table';

import Icon from '@c/icon';
import Table from '@c/table';
import PopConfirm from '@c/pop-confirm';

import store from '../store';
import CustomPageModal from './custom-page-model';
import FormRightsSettingModal from './form-rights-setting-modal';

function PageFormTable({ rightsGroupID }: { rightsGroupID: string }): JSX.Element {
  const [showSettingModal, setShowModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [curForm, setCurForm] = useState<null | PageInfo>(null);

  const handleSetting = (pageForm: PageInfo): void => {
    setCurForm(pageForm);
    setShowModal(true);
  };

  const delPer = (formID: string): void => {
    store.deleteFormPer(formID, rightsGroupID);
  };

  useEffect(() => {
    store.setRightsGroupID(rightsGroupID);
    store.fetchPerGroupForm(rightsGroupID);
  }, []);

  const columns: UnionColumns<PerPageInfo>[] = [
    {
      Header: '表单页面',
      id: 'name',
      accessor: 'name',
    },
    {
      Header: '操作权限',
      id: 'authority',
      accessor: ({ authority }: { authority: number }) => {
        if (authority) {
          return (
            <span>
              {[
                authority >= 1 ? '查看' : '',
                authority >= 3 ? '新建' : '',
                authority >= 7 ? '修改' : '',
                authority >= 15 ? '删除' : '',
              ].filter((text) => text).join(',')}
            </span>
          );
        }

        return <span>未设置</span>;
      },
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
      <div className="rounded-8 border-gray-200 border mt-16 mb-20">
        <div className="flex justify-between items-center p-10 border-b border-gray-200">
          <div className="mr-8 text-h6-bold flex items-center">
            <Icon name="settings" size={20} className="mr-8"/>自定义页面权限
          </div>
          <span>
            <Icon
              size={24}
              clickable
              changeable
              name="edit"
              className="mr-8 text-blue-600"
              onClick={() => setShowCustomModal(true)}
            />
          </span>
        </div>
        <div className="m-16">
          {store.perCustomList.filter((item) => store.perCustomPage.indexOf(item.id) > -1).map((itm) => {
            return <span className='page-item' key={itm.id}>{itm.name}</span>;
          })
          }
        </div>
      </div>
      <Table
        className='rounded-8 border-gray-200 border'
        loading={store.perFormLoading}
        rowKey='id'
        data={store.perFormList}
        columns={columns} />
      {showSettingModal && curForm && (
        <FormRightsSettingModal
          pageForm={curForm}
          onCancel={() => setShowModal(false)}
          rightsGroupID={rightsGroupID}
        />
      )}
      {showCustomModal && (
        <CustomPageModal onCancel={() => setShowCustomModal(false)}/>
      )}
    </div>
  );
}

export default observer(PageFormTable);
