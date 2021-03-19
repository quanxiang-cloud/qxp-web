import React from 'react';
declare module '@QCFE/lego-ui' {
  export const LocaleProvider: any
  export const Tag: any
  export const Checkbox: any
  export const Icon: any
  export const Input: any
  export const Modal: any
  export const Message: any
  export const Control: any
  export const Form: any
  export const Dropdown: any
  export const Table: any
  export const CheckboxGroup: any
  export const Tree: any
  export const TreeNode: any
  export const Select: any
  export const Label: any
  export const Loading: any
  export const Field: any
  export const Menu: any
  export const GridTable: any
  interface TreeProps {
    className?: string
    multiple?: boolean
  }

  interface CheckboxProps {
    className?: string
    defaultChecked?: string
    checked?: boolean
    disabled?: boolean
    indeterminate?: any
    onChange?: (e: Event, checked: boolean) => void
    value?: any
    children?: any
  }

  interface TableProps {
    className?: string
  }

  interface Form {
    getFieldsValue: () => any
    validateForm: () => boolean
  }

  interface TreeData {
    title: string
    className: string
    key: string | number
    children: Array<any>
  }
}