import React, { useContext, useEffect, useState } from 'react';

import TextHeader from '@c/text-header';
import Card from '@c/card';
import Table from '@c/table';
import Button from '@c/button';
import Modal from '@c/modal';
import toast from '@lib/toast';

import flowContext from '../flow-context';
import { deleteFlowVariable, getVariableList } from '../api';
import EditVariableModal from './edit-variable-modal';

export default function Variables(): JSX.Element {
  const { flowID: flowId } = useContext(flowContext);
  const initVariableInfo: ProcessVariable = {
    flowId,
    id: '',
    name: '',
    fieldType: 'TEXT',
    code: '',
    defaultValue: '',
  };
  const [currVariable, setCurrVariable] = useState<ProcessVariable>(initVariableInfo);
  const [openVariable, setOpenVariable] = useState(false);
  const [deleteVariable, setDeleteVariable] = useState(false);
  const [data, setData] = useState<any>();

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
      accessor: (Variable: any) => {
        if (Variable.type === 'SYSTEM') {
          return (
            <span>- -</span>
          );
        }
        return (
          <>
            <span
              className="mr-16 cursor-pointer hover:text-blue-600"
              onClick={() => handleVariableInfo(Variable, 'edit')}
            >
              编辑
            </span>
            <span
              className="mr-16 cursor-pointer hover:text-blue-600"
              onClick={() => handleVariableInfo(Variable, 'delete')}
            >
              删除
            </span>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getVariableList(flowId).then((data: any) => {
      setData(data);
    });
  }, []);

  function handleVariableInfo(variable: ProcessVariable, operat: string): void {
    setCurrVariable(variable);
    if (operat === 'edit') {
      setOpenVariable(true);
      return;
    }
    setDeleteVariable(true);
  }

  function getHeader(name: string): JSX.Element {
    return (
      <span className="text-body-no-color text-gray-400">{name}</span>
    );
  }

  function handleDeleteSubmit(): void {
    deleteFlowVariable(currVariable.id as string ).then(() => {
      toast.success('删除成功');
      setCurrVariable(initVariableInfo);
      setDeleteVariable(false);
      getVariableList(flowId).then((data: any) => {
        setData(data);
      });
    }).catch((error: string) => {
      toast.error(error || '');
    });
  }

  return (
    <>
      {deleteVariable && (
        <Modal
          title={'删除变量'}
          className="static-modal"
          onClose={()=>{
            setDeleteVariable(false);
          }}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              iconName: 'close',
              onClick: ()=>{
                setCurrVariable(initVariableInfo);
                setDeleteVariable(false);
              },
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
          <div className="text-14">
            确定要删除
            <span className="mx-4 font-semibold text-gray-900 text-h5">
              {currVariable.name}
            </span>
            吗？
          </div>
        </Modal>
      )}

      {openVariable && (
        <EditVariableModal
          variable={currVariable}
          closeModal={()=>{
            setOpenVariable(false);
            setCurrVariable(initVariableInfo);
            getVariableList(flowId).then((data: any) => {
              setData(data);
            });
          }}
        />
      )}
      <div className="w-full flex flex-col">
        <TextHeader
          className="h-56 items-center flex px-20 bg-gray-1000 shadow-header text-gray-900 mb-20"
          title="工作流变量"
          titleClassName="text-h5"
          descClassName="text-caption mt-1"
          desc=""
          action={(
            <div className="text-underline text-body2 cursor-pointer">如何使用变量</div>
          )}
        />
        <Card className="self-center rounded-12 overflow-hidden px-24 py-16 mb-100 w-full max-w-%90">
          <div className="w-full">
            <Button
              iconName="add"
              onClick={(): void => handleVariableInfo(currVariable, 'edit')}
              className="mr-16"
            >
              新增变量
            </Button>
            <Table
              rowKey="code"
              data={data || []}
              loading={!data}
              columns={columns}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
