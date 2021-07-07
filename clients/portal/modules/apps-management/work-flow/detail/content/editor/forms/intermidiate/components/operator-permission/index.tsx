import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import Loading from '@c/loading';
import ErrorTips from '@c/error-tips';
import { getOperationList } from '@flowEditor/forms/api';
import type {
  Operation,
  OperationPermission as OperationPermissionType,
  NodeType,
  FillInData,
} from '@flowEditor/type';

import PermissionList from './permission-list';

interface Props {
  value: OperationPermissionType;
  onChange: (value: Partial<FillInData>) => void;
  type?: NodeType;
}

export default function OperatorPermission({ value, onChange, type }: Props): JSX.Element {
  const { data, isLoading, isError } = useQuery(['GET_OPERATION_LIST', type], getOperationList);
  const [mergedOperations, setMergedOperations] = useState<OperationPermissionType>({
    system: [], custom: [],
  });

  useEffect(() => {
    if (data?.custom?.length || data?.system?.length) {
      mergeOperation();
    }
  }, [data, value]);

  function mergeOperation(): void {
    let { custom = [], system = [] } = value;
    const isCustomEmpty = !custom.length;
    const isSystemEmpty = !system.length;
    const customValues = custom.map(({ name, value }) => `${value}.${name}`);
    const systemValues = system.map(({ name, value }) => `${value}.${name}`);
    const dataCustomValues = data?.custom?.map(({ name, value }) => `${value}.${name}`) ?? [];
    const dataSystemValues = data?.system?.map(({ name, value }) => `${value}.${name}`) ?? [];
    data?.custom.forEach((op) => {
      if (isCustomEmpty || !customValues.includes(`${op.value}.${op.name}`)) {
        custom.push(op);
      }
    });
    data?.system?.forEach((op) => {
      if (isSystemEmpty || !systemValues.includes(`${op.value}.${op.name}`)) {
        system.push(op as Operation);
      }
    });
    custom = custom.map((item) => {
      const val = `${item.value}${item.name}`;
      const cItem = data?.custom?.find(({ name, value }) => `${value}${name}` === val) || {};
      return { ...cItem, ...item };
    });
    system = system.map((item) => {
      const val = `${item.value}${item.name}`;
      const sItem = data?.system?.find(({ name, value }) => `${value}${name}` === val) || {};
      return { ...sItem, ...item };
    });
    setMergedOperations({
      custom: custom.filter((op) => dataCustomValues.includes(`${op.value}.${op.name}`)),
      system: system.filter((op) => dataSystemValues.includes(`${op.value}.${op.name}`)),
    });
  }

  if (isLoading || !mergedOperations) {
    return <Loading desc="加载中..." />;
  }

  if (isError) {
    return <ErrorTips desc="出错了..." />;
  }

  return (
    <>
      <div className="text-caption-no-color text-gray-400 mt-16 mb-12">
        在此设置该节点负责人在处理工作流时可进行的操作
      </div>
      <header className="flex items-center px-10 py-8 bg-gray-100 rounded-8 justify-between">
        <div className="text-center flex-1">是否开启</div>
        <div className="text-center flex-1">操作</div>
        <div className="text-center flex-2">按钮文案</div>
        <div className="text-center flex-1">理由必填</div>
      </header>
      <PermissionList
        label="默认操作"
        operationData={mergedOperations}
        type="system"
        onChange={onChange}
      />
      <PermissionList
        label="自定义操作"
        operationData={mergedOperations}
        type="custom"
        onChange={onChange}
      />
    </>
  );
}
