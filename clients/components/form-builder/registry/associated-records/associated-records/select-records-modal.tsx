import React, { useState } from 'react';
import { Column } from 'react-table';
import { get } from 'lodash';

import Modal, { FooterBtnProps } from '@c/modal';
import Table from '@c/table';
import Pagination from '@c/pagination';
import { useQuery } from 'react-query';
import { fetchTableData } from './api';

// columns of SelectRecordsModal and AssociatedRecords should be different
// refactor this or just use the same component in app-table-data
function computeTableColumns(schema: ISchema, columns: string[]): Column<Record<string, any>>[] {
  return columns.map((fieldKey) => {
    const fieldSchema = get(schema, `properties.${fieldKey}`, {});

    return {
      id: fieldKey,
      Header: fieldSchema.title || fieldKey,
      accessor: fieldKey,
    };
  }).filter(({ id }) => id !== '_id');
}

type Props = {
  onClose: () => void;
  onSubmit: (selected: Record<string, any>[]) => void;
  appID: string;
  tableID: string;
  multiple: 'single' | 'multiple';
  associatedTable: ISchema;
  columns: string[];
}

export default function SelectRecordsModal({
  onClose, appID, tableID, multiple, associatedTable, columns, onSubmit,
}: Props):JSX.Element {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selected, setSelected] = useState<Record<string, any>[]>([]);
  const {
    data, isLoading, isError,
  } = useQuery([pageNumber], () => fetchTableData(appID, tableID, pageNumber, pageSize));

  const tableColumns = computeTableColumns(associatedTable, columns);
  if (multiple === 'single') {
    tableColumns.push({
      id: 'select_this',
      Header: '',
      accessor: (row) => {
        return (
          <div
            className="cursor-pointer hover:text-blue-600"
            onClick={() => onSubmit([row])}
          >
            选择
          </div>
        );
      },
    });
  }

  if (isLoading) {
    return (
      <Modal onClose={onClose}>
        <div>loading...</div>
      </Modal>
    );
  }

  if (!data || isError) {
    return (
      <Modal onClose={onClose}>
        <div>some error</div>
      </Modal>
    );
  }

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
      onClick: () => onSubmit(selected),
    },
  ];

  return (
    <Modal
      title="选择关联记录"
      onClose={onClose}
      footerBtns={multiple === 'multiple' ? btns : undefined}
    >
      <Table
        showCheckbox={multiple === 'multiple'}
        rowKey="_id"
        onSelectChange={(selectedKey, selectedRows) => setSelected(selectedRows)}
        columns={tableColumns}
        data={data.entities}
      />
      <Pagination
        pageSize={pageSize}
        current={pageNumber}
        onChange={(current, size) => {
          setPageNumber(current);
          setPageSize(size);
        }}
      />
    </Modal>
  );
}
