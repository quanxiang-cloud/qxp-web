import React, { useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import TextHeader from '@c/text-header';

import store from './store';
import EditModal from './models-nav/edit-modal';
import ModelsNav from './models-nav';
import ModelFieldDetails from './model-field-details';
import EditorFieldModals from './model-field-details/editor-field-modals';

import './index.scss';

function DataModels(): JSX.Element {
  const { appID } = useParams<AppParams>();
  const {
    saveDataModel,
    editModalType,
    curModelField,
    editFieldType,
    fetchDataModels,
    setEditModalType,
    setCurModelField,
    setEditFieldType,
  } = store;

  useEffect(() => {
    store.appID = appID;
    fetchDataModels();
  }, []);

  function handleEditModal(modalInfo: DataModelBasicInfo): void {
    saveDataModel(modalInfo, editModalType);
  }

  function onClose(): void {
    if (editFieldType === 'delete') {
      setCurModelField(null);
    }
    setEditFieldType('');
  }

  return (
    <div className="flex-1 bg-white rounded-t-12 h-full">
      <TextHeader
        title="数据模型"
        itemTitleClassName="text-12 font-semibold"
        desc="支持可视化的构建数据模型，包括数据模型字段以及模型之间外键关联。"
        actionClassName="text-12"
        // action={<a className="ease-linear underline">📌 &nbsp;快速开始？</a>}
        className="bg-gray-1000 p-16 header-background-image h-44 shadow-header rounded-t-12"
        descClassName="text-gray-400"
      />
      <div className="flex text-gray-600" style={{ height: 'calc(100% - 44px)' }}>
        <ModelsNav />
        <ModelFieldDetails />
      </div>
      {!!editModalType && (
        <EditModal
          modalType={editModalType}
          handleEditModel={handleEditModal}
          onClose={() => setEditModalType('')}
        />
      )}
      {!!editFieldType && (
        <EditorFieldModals
          onClose={onClose}
          type={editFieldType}
          curModelField={toJS(curModelField)}
        />
      )}
    </div>
  );
}

export default observer(DataModels);
