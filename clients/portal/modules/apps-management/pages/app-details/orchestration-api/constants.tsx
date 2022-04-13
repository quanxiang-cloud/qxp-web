import React, { CSSProperties } from 'react';

import Icon from '@c/icon';

import createNamespaceSchema from './schema/create-namespace';
import editNamespaceSchema from './schema/edit-namespace';
import createPolySchema from './schema/create-poly';
import createChildNamespaceSchema from './schema/create-child-namespace';

export enum ModalType {
  CREATE_NAMESPACE = 'createNamespace',
  CREATE_CHILD_NAMESPACE = 'createChildNamespace',
  EDIT_NAMESPACE = 'editNamespace',
  REMOVE_NAMESPACE = 'removeNamespace',
  CREATE_POLY = 'createPoly',
  REMOVE_POLY = 'removePoly',
  REMOVE_POLY_ALL = 'removePolyAll',
}

export const MODAL_SCHEMA_MAP: Record<ModalType, [ISchema, string]> = {
  [ModalType.CREATE_NAMESPACE]: [createNamespaceSchema, '新建分组'],
  [ModalType.CREATE_CHILD_NAMESPACE]: [createChildNamespaceSchema, '新建子分组'],
  [ModalType.EDIT_NAMESPACE]: [editNamespaceSchema, '修改组信息'],
  [ModalType.CREATE_POLY]: [createPolySchema, '新建 API'],
  [ModalType.REMOVE_NAMESPACE]: [{}, '提示'],
  [ModalType.REMOVE_POLY]: [{}, '提示'],
  [ModalType.REMOVE_POLY_ALL]: [{}, '提示'],
};

type APINamespaceMenu = Array<{
  key: ModalType;
  label: JSX.Element;
  className?: string;
  style?: CSSProperties;
}>

export const API_DIRECTORY_MENUS: APINamespaceMenu = [
  {
    className: 'transition-all duration-240',
    key: ModalType.CREATE_CHILD_NAMESPACE,
    label: (
      <div className="flex items-center">
        <Icon name="add" size={16} className="mr-8" />
        <span className="font-normal">新建子分组</span>
      </div>
    ),
  },
  {
    className: 'transition-all duration-240',
    key: ModalType.EDIT_NAMESPACE,
    label: (
      <div className="flex items-center">
        <Icon name="create" size={16} className="mr-8" />
        <span className="font-normal">编辑组信息</span>
      </div>
    ),
  },
  {
    className: 'transition-all duration-240 namespace-menu--remove',
    key: ModalType.REMOVE_NAMESPACE,
    label: (
      <div className="flex items-center">
        <Icon name="delete" size={16} className="mr-8 text-red-600" />
        <span className="font-normal text-red-600">删除</span>
      </div>
    ),
  },
];
