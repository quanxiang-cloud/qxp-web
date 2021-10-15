import React from 'react';

import type { Placement } from '@popperjs/core';
import Icon from '@c/icon';

import createNamespaceSchema from './schema/create-namespace';
import editNamespaceSchema from './schema/edit-namespace';
import createPolySchema from './schema/create-poly';

export const POPPER_PARAMS = {
  modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
  placement: 'bottom-end' as Placement,
};

export enum ModalType {
  CREATE_NAMESPACE = 'createNamespace',
  EDIT_NAMESPACE = 'editNamespace',
  REMOVE_NAMESPACE = 'removeNamespace',
  CREATE_POLY = 'createPoly',
  REMOVE_POLY = 'removePoly',
}

export const MODAL_SCHEMA_MAP: Record<ModalType, [ISchema, string]> = {
  [ModalType.CREATE_NAMESPACE]: [createNamespaceSchema, '新增分组'],
  [ModalType.EDIT_NAMESPACE]: [editNamespaceSchema, '编辑分组'],
  [ModalType.CREATE_POLY]: [createPolySchema, '新建API'],
  [ModalType.REMOVE_NAMESPACE]: [{}, ''],
  [ModalType.REMOVE_POLY]: [{}, ''],
};

type APINamespaceMenu = Array<{
  key: ModalType;
  label: JSX.Element;
}>

export const API_DIRECTORY_MENUS: APINamespaceMenu = [
  {
    key: ModalType.CREATE_NAMESPACE,
    label: (
      <div className="flex items-center">
        <Icon name="control_point" size={16} className="mr-8" />
        <span className="font-normal">新建子分组</span>
      </div>
    ),
  },
  {
    key: ModalType.EDIT_NAMESPACE,
    label: (
      <div className="flex items-center">
        <Icon name="create" size={16} className="mr-8" />
        <span className="font-normal">编辑组信息</span>
      </div>
    ),
  },
  {
    key: ModalType.REMOVE_NAMESPACE,
    label: (
      <div className="flex items-center">
        <Icon name="settings" size={16} className="mr-8 text-red-600" />
        <span className="font-normal text-red-600">删除</span>
      </div>
    ),
  },
];
