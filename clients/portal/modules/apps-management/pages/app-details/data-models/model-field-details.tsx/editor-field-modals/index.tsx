import React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import EditorFieldModal from './edit-modal';
import DeleteFieldModal from './delete-modal';

type Props = {
  type: string;
  onClose: () => void;
  curModelField: ModelField | undefined;
}

function Modals({ type, curModelField, onClose }: Props): JSX.Element {
  const { saveDataModel, basicInfo, delModelField, addModelField } = store;

  function delConfirm(): void {
    if (curModelField) {
      delModelField(curModelField.id);
      saveDataModel({
        ...basicInfo,
        tableID: basicInfo.tableID.split('_').pop() || '',
      }, 'delete');
    }

    onClose();
  }

  function editConfirm(value: ModelField): void {
    addModelField(value);
    saveDataModel({
      ...basicInfo,
      tableID: basicInfo.tableID.split('_').pop() || '',
    }, type);
  }

  return (
    <>
      {['create', 'edit'].includes(type) && (
        <EditorFieldModal
          field={curModelField}
          onSubmit={editConfirm}
          onCancel={onClose}
        />
      )}
      {type === 'delete' && <DeleteFieldModal delConfirm={delConfirm} onClose={onClose} />}
    </>
  );
}

export default observer(Modals);
