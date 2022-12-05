import React, { useRef } from 'react';

import Modal from '@c/modal';
import FormDataTable from '@c/form-app-data-table';
import { Ref } from '@c/form-app-data-table/type';
import Checkbox from '@c/checkbox';

type Props = {
  onClose: () => void;
  onSubmit: (dataRow: Record<string, any>, schema: ISchema) => void;
  appID: string;
  fieldName: string;
  tableID: string;
  filterConfig?: FilterConfig;
}

export default function SelectAssociationModal({
  onClose, appID, tableID, onSubmit, fieldName, filterConfig,
}: Props): JSX.Element {
  const tableRef: React.MutableRefObject<Ref | undefined> = useRef<Ref>();
  const handleSelect = (rowData: Record<string, any>): void => {
    // todo Layout
    const schema = tableRef?.current?.getSchema()?.properties?.[fieldName] as ISchema;
    onSubmit(rowData, schema);
  };

  const customColumnsBefore = [
    {
      id: 'action',
      fixed: true,
      // Headers: '操作',
      Headers: ' ',
      accessor: (rowData: any) => {
        return (
          // <div className='text-btn' onClick={() => handleSelect(rowData)}>选择</div>
          <Checkbox onClick={() => handleSelect(rowData)}/>
        );
      },
    },
  ];

  return (
    <Modal
      title="选择关联数据"
      onClose={onClose}
    >
      <div className="p-20" style={{ minHeight: '200px' }}>
        <FormDataTable
          allowRequestData
          showCheckbox={false}
          filterConfig={filterConfig}
          customColumns={[]}
          customColumnsBefore={customColumnsBefore}
          ref={tableRef as React.Ref<Ref>}
          pageID={tableID}
          appID={appID}
        />
      </div>
    </Modal>
  );
}
