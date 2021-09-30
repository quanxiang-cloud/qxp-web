import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import TextHeader from '@c/text-header';

import store from './store';
import EditModal from './models-nav/edit-modal';
import ModelsNav from './models-nav';
import ModelFieldDetails from './model-field-details.tsx';

import './index.scss';

function DataModels(): JSX.Element {
  const { appID } = useParams<AppParams>();
  const { saveDataModel, editModalType, setEditModalType, fetchDataModels } = store;

  useEffect(() => {
    fetchDataModels();
  }, []);

  useEffect(() => {
    store.appID = appID;
  }, [appID]);

  function handleEditModal(modalInfo: DataModelBasicInfo): void {
    saveDataModel(modalInfo, editModalType);
  }

  return (
    <div className="flex-1 bg-white rounded-t-12 h-full">
      <TextHeader
        title="数据模型"
        itemTitleClassName="text-h5"
        desc="支持可视化的构建数据模型，包括数据模型字段以及模型之间外键关联。"
        action={<a className="ease-linear text-underline">📌  数据模型可以用来做什么？</a>}
        className="bg-gray-1000 p-16 header-background-image h-56 shadow-header rounded-t-12"
        descClassName="text-caption"
      />
      <div className={'flex text-gray-600'} style={{ height: 'calc(100% - 56px)' }}>
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
    </div>
  );
}

export default observer(DataModels);
