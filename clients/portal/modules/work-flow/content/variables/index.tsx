import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';

import TextHeader from '@c/text-header';
import Button from '@c/button';
import Modal from '@c/modal';
import Table from '@c/table';
import toast from '@lib/toast';
import flowContext from '@flow/flow-context';
import { deleteFlowVariable, getVariableList } from '@flow/api';

import EditVariableModal from './edit-variable-modal';

export default function Variables(): JSX.Element {
  const { flowID: flowId } = useContext(flowContext);
  const initVariableInfo: ProcessVariable = {
    flowId,
    id: '',
    name: '',
    fieldType: 'string',
    code: '',
    defaultValue: '',
    type: 'CUSTOM',
    desc: '',
  };
  const [currentVariable, setCurrentVariable] = useState<ProcessVariable>(initVariableInfo);
  const [currentAction, setCurrentAction] = useState<'edit' | 'remove' | 'add' | ''>('');
  const { data, isLoading, refetch } = useQuery('GET_VARIABLE_LIST', () => getVariableList(flowId), {
    cacheTime: -1,
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      Header: () => getHeader('名称'),
      id: 'name',
      accessor: 'name',
    }, {
      Header: () => getHeader('类型'),
      id: 'type',
      accessor: (Variable: any) => {
        return (
          <span>{Variable.type === 'SYSTEM' ? '系统变量' : '自定义变量'}</span>
        );
      },
    }, {
      Header: () => getHeader('类型'),
      id: 'fieldType',
      accessor: 'fieldType',
    }, {
      Header: () => getHeader('默认值'),
      id: 'defaultValue',
      accessor: 'defaultValue',
    }, {
      Header: () => getHeader(''),
      id: 'tool',
      accessor: (variable: ProcessVariable) => {
        if (variable.type === 'SYSTEM') {
          return (
            <span>- -</span>
          );
        }
        return (
          <>
            <span
              className="text-blue-600 cursor-pointer mr-16"
              onClick={() => updateCurrentAction(variable, 'edit')}
            >
              编辑
            </span>
            <span
              className="text-red-600 cursor-pointer"
              onClick={() => updateCurrentAction(variable, 'remove')}
            >
              删除
            </span>
          </>
        );
      },
    },
  ];

  function getHeader(name: string): JSX.Element {
    return (
      <span className="text-body-no-color text-gray-400">{name}</span>
    );
  }

  function handleDeleteSubmit(): void {
    deleteFlowVariable(currentVariable.id).then(() => {
      toast.success('删除成功');
      refetch();
      handleCloseModal();
    }).catch((error: string) => {
      toast.error(error || '');
    });
  }

  function updateCurrentAction(variable: ProcessVariable, action: 'add' | 'remove' | 'edit' | ''): void {
    setCurrentVariable(variable);
    setCurrentAction(action);
  }

  function handleCloseModal(): void {
    setCurrentVariable(initVariableInfo);
    setCurrentAction('');
  }

  function handleAddSubmit(): void {
    refetch();
    handleCloseModal();
  }

  return (
    <div className="flex-1 m-16 f overflow-auto mb-0 bg-white rounded-t-12">
      <TextHeader
        title="工作流变量"
        itemTitleClassName="text-12 font-semibold"
        desc="设置工作流变量"
        actionClassName="text-12"
        // action={<a className="ease-linear underline">📌 &nbsp;快速开始？</a>}
        className="bg-gray-1000 p-16 header-background-image h-44 shadow-header rounded-t-12"
        descClassName="text-gray-400"
      />
      <div className="flex flex-col w-full p-16 h-full" style={{ height: 'calc(100% - 44px)' }}>
        <div className="flex justify-between mb-16">
          <Button
            iconName="add"
            modifier="primary"
            onClick={() => updateCurrentAction(currentVariable, 'add')}
          >新增变量</Button>
        </div>
        <div className="flex-1 flex flex-col flow-table">
          <Table<any>
            rowKey="code"
            data={data || []}
            loading={isLoading}
            columns={columns}
          />
        </div>
      </div>
      {currentAction === 'remove' && (
        <Modal
          title={'删除变量'}
          className="static-modal"
          onClose={handleCloseModal}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: handleCloseModal,
            },
            {
              text: '删除变量',
              key: 'confirm',
              iconName: 'check',
              modifier: 'primary',
              onClick: handleDeleteSubmit,
            },
          ]}
        >
          <div className="text-14 p-20">
            确定要删除
            <span className="mx-4 font-semibold text-gray-900 text-h5">
              {currentVariable.name}
            </span>
            吗？
          </div>
        </Modal>
      )}
      {(currentAction === 'edit' || currentAction === 'add') && (
        <EditVariableModal
          variable={currentVariable}
          closeModal={handleCloseModal}
          onAdded={handleAddSubmit}
        />
      )}
    </div>
  );
}
