import React, { useRef } from 'react';

import Modal, { FooterBtnProps } from '@c/modal';
import FormDataTable from '@c/form-app-data-table';
import { Ref } from '@c/form-app-data-table/type';

type Props = {
  onClose: () => void;
  onSubmit: (selected: string[]) => void;
  appID: string;
  tableID: string;
  multiple: boolean;
  associatedTable: ISchema;
  columns: string[];
}

export default function SelectRecordsModal({
  onClose, appID, tableID, multiple, onSubmit,
}: Props): JSX.Element {
  const tableRef: React.Ref<any> = useRef<Ref>();

  const handleSubmit = (): void => {
    if (!tableRef.current) {
      return;
    }

    onSubmit(tableRef.current.getSelected());
  };

  const btns: FooterBtnProps[] = [
    {
      key: 'cancel',
      text: '取消',
      onClick: onClose,
    },
    {
      key: 'submit',
      text: '确定',
      modifier: 'primary',
      onClick: handleSubmit,
    },
  ];

  return (
    <Modal
      title="选择关联记录"
      onClose={onClose}
      footerBtns={multiple ? btns : undefined}
    >
      <FormDataTable
        allowRequestData
        ref={tableRef}
        pageID={tableID}
        appID={appID}
      />
    </Modal>
  );
}
