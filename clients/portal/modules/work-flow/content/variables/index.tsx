import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';

import TextHeader from '@c/text-header';
import Card from '@c/card';
import Table from '@c/table';
import Button from '@c/button';
import Modal from '@c/modal';
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
              className="mr-16 cursor-pointer hover:text-blue-600"
              onClick={() => updateCurrentAction(variable, 'edit')}
            >
              编辑
            </span>
            <span
              className="mr-16 cursor-pointer hover:text-blue-600"
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
    <>
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
      <div className="w-full flex flex-col">
        <TextHeader
          className="h-56 items-center flex px-20 bg-gray-1000 shadow-header text-gray-900 mb-20"
          title="工作流变量"
          titleClassName="text-h5"
          descClassName="text-caption mt-1"
          desc=""
          // action={(
          //   <div className="text-underline text-body2 cursor-pointer">如何使用变量</div>
          // )}
        />
        <Card className="self-center rounded-12 overflow-hidden px-24 py-16 mb-100 w-full max-w-%90">
          <div className="w-full">
            <Button
              iconName="add"
              onClick={() => updateCurrentAction(currentVariable, 'add')}
              className="mr-16"
            >
              新增变量
            </Button>
            <Table<any>
              rowKey="code"
              data={data || []}
              loading={isLoading}
              columns={columns}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
