import React, { useRef } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import Modal from '@c/modal';
import toast from '@lib/toast';

import FormAddData, { FormAddDataRef } from './form-add-data';

import store from './store';
import { createOptionSet, updateOptionSet, deleteOptionSet } from './api';

interface Props {
  modalType: string;
  isNoData?: boolean;
}

function ShowModal({ modalType, isNoData = false }: Props): JSX.Element {
  const formAddRef = useRef<FormAddDataRef>(null);

  const history = useHistory();

  const handleAddConfirm = (): void => {
    const { option_set_name, option_set_tag } = formAddRef?.current?.getValues();
    const formStatus = formAddRef?.current?.validate();
    if (!formStatus) return;
    createOptionSet({
      name: option_set_name,
      tag: option_set_tag,
      type: store.queryType === 'list' ? 1 : 2,
    }).then((data) => {
      if (data?.id) {
        toast.success('创建成功');
        store.modalOpen = false;
        store.setNames([...store.optionSetNames, {
          id: data.id,
          name: option_set_name,
          tag: option_set_tag,
          type: store.queryType === 'list' ? 1 : 2,
        }]);
        if (!isNoData || option_set_name.search(store.search) !== -1) {
          store.setActive(data.id);
          history.push(`/apps/option-set?type=${store.queryType}&id=${data.id}`);
        }
      } else {
        toast.error('创建失败');
      }
    }).catch((err: Error) => {
      toast.error(err.message);
    }).finally(()=>{
      store.fetchAllNames({ name: store.search });
    });
  };

  const handleEditConfirm = (): void => {
    const { option_set_name, option_set_tag } = formAddRef?.current?.getValues();
    const formStatus = formAddRef?.current?.validate();
    if (!formStatus) return;
    if (store.activeOptionSet?.name === option_set_name && store.activeOptionSet?.tag === option_set_tag) {
      toast.error('数据未更改');
      return;
    }
    updateOptionSet({
      id: store.activeId,
      name: option_set_name,
      tag: option_set_tag,
      type: store.queryType === 'list' ? 1 : 2,
      content: store.activeOptionSet?.content,
    }).then(async (data) => {
      if (data) {
        toast.success('更新成功');
        store.modalOpen = false;
        for (const itm of store.optionSetNames) {
          if (itm.id === store.activeId) {
            itm.name = option_set_name;
            itm.tag = option_set_tag;
          }
        }
        await store.fetchOptionSet(store.activeId);
      } else {
        toast.error('更新失败');
      }
    }).catch((err: Error) => {
      toast.error(err.message);
    });
  };

  const handleDeleteConfirm = (): void => {
    deleteOptionSet(store.activeId).then(async (data) => {
      if (data) {
        toast.success('删除成功');
        store.modalOpen = false;
        store.setNames(store.optionSetNames.filter((itm) => itm.id !== store.activeId));
        store.setActive('', store.queryType);
        history.push(`/apps/option-set?type=${store.queryType}&id=${store.activeId}`);
      } else {
        toast.error('删除失败');
      }
    }).catch((err: Error) => toast.error(err.message));
  };

  const handleCopyConfirm = (): void => {
    const {
      option_set_name, option_set_tag, option_set_expand,
    } = formAddRef?.current?.getValues();
    const apiType = option_set_expand.length === 1 ? 1 : 2;
    const queryType = option_set_expand.length === 1 ? 'list' : 'tree';
    const formStatus = formAddRef?.current?.validate();
    if (!formStatus) return;
    createOptionSet({
      name: option_set_name,
      tag: option_set_tag,
      type: apiType,
      content: store.activeOptionSet?.content,
    }).then(async (data) => {
      if (data?.id) {
        toast.success('复制成功');
        store.modalOpen = false;
        store.setNames([...store.optionSetNames, {
          id: data.id,
          name: option_set_name,
          tag: option_set_tag,
          type: apiType,
          content: store.activeOptionSet?.content,
        }]);
        store.setActive(data.id);
        store.queryType = queryType;
        history.push(`/apps/option-set?type=${queryType}&id=${data.id}`);
      } else {
        toast.error('复制失败');
      }
    }).catch((err: Error) => {
      toast.error(err.message);
    });
  };

  if (modalType === 'add') {
    return (
      <Modal
        title="添加选项集"
        onClose={() => {
          store.modalOpen = false;
        }}
        footerBtns={[
          {
            text: '取消',
            key: 'cancel',
            iconName: 'close',
            onClick: () => {
              store.modalOpen = false;
            },
          },
          {
            text: '确定添加',
            key: 'confirm',
            iconName: 'check',
            modifier: 'primary',
            onClick: handleAddConfirm,
          },
        ]}
      >
        <FormAddData className="p-20" ref={formAddRef} />
      </Modal>
    );
  }
  if (modalType === 'edit') {
    return (
      <Modal
        title="编辑选项集"
        onClose={() => {
          store.modalOpen = false;
        }}
        footerBtns={[
          {
            text: '取消',
            key: 'cancel',
            iconName: 'close',
            onClick: () => {
              store.modalOpen = false;
            },
          },
          {
            text: '保存',
            key: 'confirm',
            iconName: 'check',
            modifier: 'primary',
            onClick: handleEditConfirm,
          },
        ]}
      >
        <FormAddData
          className="p-20"
          ref={formAddRef}
          editInfo={toJS(store.activeOptionSet) as OptionSetItem & { type: OptionSetType }}
        />
      </Modal>
    );
  }
  if (modalType === 'delete') {
    return (
      <Modal
        title="删除选项集"
        onClose={() => {
          store.modalOpen = false;
        }}
        footerBtns={[
          {
            text: '取消',
            key: 'cancel',
            iconName: 'close',
            onClick: () => {
              store.modalOpen = false;
            },
          },
          {
            text: '确定删除',
            key: 'confirm',
            iconName: 'check',
            modifier: 'primary',
            onClick: handleDeleteConfirm,
          },
        ]}
      >
        <p className="p-20 font-semibold">
            确定删除该选项集吗?
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      title="复制"
      onClose={() => {
        store.modalOpen = false;
      }}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: () => {
            store.modalOpen = false;
          },
        },
        {
          text: '确定复制',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleCopyConfirm,
        },
      ]}
    >
      <FormAddData
        className="p-20"
        ref={formAddRef}
        canExpand={true}
        editInfo={
          {
            name: `复制：${store.activeOptionSet?.name || ''}`,
            tag: store.activeOptionSet?.tag,
          }
        }
      />
    </Modal>
  );
}

export default observer(ShowModal);
