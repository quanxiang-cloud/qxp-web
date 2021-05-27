import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import cs from 'classnames';
import { Form } from '@QCFE/lego-ui';

import Search from '@c/search';
import Loading from '@c/loading';
import Icon from '@c/icon';
import Button from '@c/button';
import MoreMenu from '@c/more-menu';
import Modal from '@c/modal';
import toast from '@lib/toast';

import FormAddData from './form-add-data';

import store from './store';
import { createDataset, updateDataset, deleteDataset } from './api';

interface Props {
  className?: string;
}

function DatasetNames(props: Props) {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addDataModal, setAddDataModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formAddRef = useRef<Form>(null);

  useEffect(() => {
    store.fetchAllNames().then(() => {
      if (store.names.length) {
        store.setActive(store.names[0].id);
      }
    });
    return store.reset;
  }, []);

  return (
    <div className="dataset-names py-20 px-10 mr-20">
      {store.loadingNames ? <Loading /> : (
        <>
          <div className="dataset-names--toolbar flex items-center">
            <Search placeholder="请输入名称进行查询" />
            <Button iconName="add" className="btn--add" onClick={() => setAddDataModal(true)}>分组</Button>
          </div>
          <div className="mt-20">
            {store.names.map(({ id, name, tag }) => {
              return (
                <div
                  className={cs('name-item flex items-center cursor-pointer pl-20 py-8 hover:bg-gray-100', {
                    active: store.activeId === id,
                  })}
                  key={id}
                  onClick={() => store.setActive(id)}
                >
                  <Icon name="insert_drive_file" size={20} />
                  <span className="ml-10 flex-grow">{name}</span>
                  <MoreMenu
                    className="action-more mr-10"
                    onMenuClick={(key) => {
                      if (key === 'edit') {
                        setEditModal(true);
                      }
                      if (key === 'delete') {
                        setDeleteModal(true);
                      }
                    }}
                    menus={[
                      { label: '编辑', key: 'edit' },
                      { label: '删除分组', key: 'delete' },
                    ]} />
                </div>
              );
            })}
          </div>
        </>
      )}
      {addDataModal && (
        <Modal
          title="新增数据集"
          onClose={() => setAddDataModal(false)}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setAddDataModal(false),
            },
            {
              text: '确定',
              key: 'confirm',
              iconName: 'check',
              forbidden: submitting,
              modifier: 'primary',
              onClick: () => {
                // @ts-ignore
                const { dataset_name, dataset_tag, type } = formAddRef?.current?.getValues();
                if (!dataset_name) {
                  toast.error('请输入数据集名称');
                  return;
                }
                setSubmitting(true);
                createDataset({
                  name: dataset_name,
                  tag: dataset_tag,
                  type,
                }).then((data) => {
                  if (data?.id) {
                    toast.success('创建成功');
                    setAddDataModal(false);
                    store.fetchAllNames();
                  } else {
                    toast.error('创建失败');
                  }
                }).catch((err: Error) => {
                  toast.error(err.message);
                }).finally(() => {
                  setSubmitting(false);
                });
              },
            },
          ]}
        >
          <FormAddData ref={formAddRef} />
        </Modal>
      )}
      {editModal && (
        <Modal
          title="编辑数据集"
          onClose={() => setEditModal(false)}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setEditModal(false),
            },
            {
              text: '确定',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => {
                // @ts-ignore
                const { dataset_name, dataset_tag, type } = formAddRef?.current?.getValues();
                if (!dataset_name) {
                  toast.error('请输入数据集名称');
                  return;
                }
                setSubmitting(true);
                updateDataset({
                  id: store.activeId,
                  name: dataset_name,
                  tag: dataset_tag,
                  type,
                  content: store.activeDataset?.content,
                }).then(async (data) => {
                  if (data) {
                    toast.success('更新成功');
                    setEditModal(false);
                    await store.fetchAllNames();
                    await store.fetchDataset(store.activeId);
                  } else {
                    toast.error('更新失败');
                  }
                }).catch((err: Error) => {
                  toast.error(err.message);
                }).finally(() => {
                  setSubmitting(false);
                });
              },
            },
          ]}
        >
          <FormAddData ref={formAddRef} editInfo={toJS(store.activeDataset) as DatasetName & { type: DatasetType }} />
        </Modal>
      )}
      {deleteModal && (
        <Modal
          title="删除数据集"
          onClose={() => setDeleteModal(false)}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: () => setDeleteModal(false),
            },
            {
              text: '确定',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => {
                setSubmitting(true);
                deleteDataset(store.activeId).then(async (data) => {
                  if (data) {
                    toast.success('删除成功');
                    setDeleteModal(false);
                    await store.fetchAllNames();
                    if (store.names.length) {
                      store.setActive(store.names[0].id);
                    }
                  } else {
                    toast.error('更新失败');
                  }
                }).catch((err: Error) => toast.error(err.message))
                  .finally(() => setSubmitting(false));
              },
            },
          ]}
        >
          确定删除该数据集吗?
        </Modal>
      )}
    </div>
  );
}

export default observer(DatasetNames);
