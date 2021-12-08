import React, { CSSProperties } from 'react';

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
  REMOVE_POLY_ALL = 'removePolyAll',
}

export const MODAL_SCHEMA_MAP: Record<ModalType, [ISchema, string]> = {
  [ModalType.CREATE_NAMESPACE]: [createNamespaceSchema, '新建分组'],
  [ModalType.EDIT_NAMESPACE]: [editNamespaceSchema, '修改组信息'],
  [ModalType.CREATE_POLY]: [createPolySchema, '新建API'],
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
    key: ModalType.CREATE_NAMESPACE,
    label: (
      <div className="flex items-center">
        <Icon name="control_point" size={16} className="mr-8" />
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
        <Icon name="settings" size={16} className="mr-8 text-red-600" />
        <span className="font-normal text-red-600">删除</span>
      </div>
    ),
  },
];
