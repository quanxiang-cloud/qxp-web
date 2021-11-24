import React, { useRef, useState } from 'react';

import Modal, { FooterBtnProps } from '@c/modal';
import FormDataTable from '@c/form-app-data-table';
import { Ref } from '@c/form-app-data-table/type';

type Props = {
  defaultValues: Record<string, any>[];
  onClose: () => void;
  onSubmit: (selected: Record<string, any>[]) => void;
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
  const [selected, setSelected] = useState<Record<string, any>[]>(defaultValues || []);
  const defaultSelectIDs = selected.map(({ _id }) => _id);

  const handleSubmit = (): void => {
    if (!tableRef.current) {
      return;
    }

    onSubmit(selected);
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

  const customColumns = multiple ? undefined : [
    {
      id: 'action',
      Header: '操作',
      fixed: true,
      accessor: (rowData: any) => {
        if (defaultSelectIDs.includes(rowData._id)) {
          return (<div>已选择</div>);
        }

        return (<div className='text-btn' onClick={() => onSubmit([rowData])}>选择</div>);
      },
    },
  ];

  return (
    <Modal
      title="选择关联记录"
      onClose={onClose}
      footerBtns={multiple ? btns : undefined}
    >
      <div className='px-20 py-10'>已选{selected.length}条</div>
      <FormDataTable
        canAcrossPageChoose
        className="p-20"
        allowRequestData
        filterConfig={filterConfig}
        showCheckbox={multiple}
        customColumns={customColumns}
        ref={tableRef}
        defaultSelect={defaultSelectIDs}
        onSelect={(_, rows) => setSelected(rows || [])}
        pageID={tableID}
        appID={appID}
      />
    </Modal>
  );
}
