import React, { useRef } from 'react';

import Modal, { FooterBtnProps } from '@c/modal';
import FormDataTable from '@c/form-app-data-table';
import { Ref } from '@c/form-app-data-table/type';

type Props = {
  defaultValues: string[];
  onClose: () => void;
  onSubmit: (selected: string[]) => void;
  appID: string;
  tableID: string;
  multiple: boolean;
  associatedTable: ISchema;
  columns: string[];
  filterConfig?: FilterConfig;
}

export default function SelectRecordsModal({
  onClose, appID, tableID, multiple, onSubmit, filterConfig, defaultValues,
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

  const customColumns = [
    {
      id: 'action',
      Headers: '操作',
      accessor: (rowData: any) => {
        if (defaultValues.includes(rowData._id)) {
          return (<div>已选择</div>);
        }

        return (<div className='text-btn' onClick={() => onSubmit([rowData._id])}>选择</div>);
      },
    },
  ];

  return (
    <Modal
      title="选择关联记录"
      onClose={onClose}
      footerBtns={multiple ? btns : undefined}
    >
      <FormDataTable
        className="p-20"
        allowRequestData
        filterConfig={filterConfig}
        showCheckbox={multiple}
        customColumns={multiple ? [] : customColumns}
        ref={tableRef}
        pageID={tableID}
        appID={appID}
      />
    </Modal>
  );
}
