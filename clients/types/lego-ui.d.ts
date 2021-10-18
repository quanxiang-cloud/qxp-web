import '@QCFE/types';
import '@qcfe/types';
import React from 'react';

declare module '@QCFE/lego-ui' {
  interface ModalProps {
    title?: string | React.ReactNode;
    type?: string;
    closable?: boolean;
    width?: number | string;
    height?: number | string;
    okText?: string;
    okType?: string;
    onOk?: () => void;
    onOpen?: () => void;
    cancelText?: string;
    cancelType?: string;
    onCancel?: () => void;
    footer?: string | React.ReactNode | null;
    mask?: boolean;
    maskClosable?: boolean;
    maskStyle?: React.CSSProperties;
    escClosable?: boolean;
    bodyStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    className?: string;
    draggable?: boolean;
    defaultLeft?: string | number;
    defaultTop?: string | number;
    resizable?: boolean;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    appendToBody?: boolean;
    confirmLoading?: boolean;
    showConfirmLoading?: boolean;
    content?: React.ReactNode;
    onAsyncOk?: (...args: any) => any;
    visible?: boolean;
  }

  interface TableProps extends GridTableProps<unknown> {
    rowKey: string;
    dataSource?: unknown[];
    columns: unknown[];
    rowSelection?: {
      selectedRowKeys: string[];
      onChange?: (selectedRowKeys: string[], selectedRows: any[]) => void;
      getCheckboxProps?: (record: unknown) => unknown;
    };
    emptyText?: JSX.Element;
    onRow?: (
      record: any
    ) => {
      onClick?: Function;
      onDoubleClick?: Function;
      onMouseEnter?: Function;
      onMouseLeave?: Function;
      onContextMenu?: Function;
    };
    pagination?: {
      type?: 'mini' | 'simple';
      current: number;
      total: number;
      pageSize: number;
      pageSizeOptions?: number[];
      className?: string;
      style?: Object;
      onChange?: (page: number) => void;
      onShowSizeChange?: (pageSize: number) => void;
    };
  }

  interface QxpFile extends File {
    uid: string;
  }
  interface UploadProps {
    name?: string;
    disabled?: boolean;
    directory?: boolean;
    action?: string;
    data?: any;
    headers?: Record<string, any>;
    accept?: string;
    multiple?: boolean;
    withCredentials?: boolean;
    className?: string;
    style?: Record<string, any>;
    onStart?: (file: QxpFile) => void;
    onProgress?: (res: any, file: QxpFile) => void;
    onSuccess?: (res: any, file: QxpFile) => void;
    onError?: (err: Error, res: Response, file: QxpFile) => void;
    beforeUpload?: (file: QxpFile) => void;
  }

  class Upload extends React.Component<UploadProps, {}> {
    abort:(id?:string) => void
  }

  interface ControlProps {
    className?: string;
    id?: string;
    tabIndex?: string;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
    name?: string;
    style?: React.CSSProperties;
  }

  interface CommonFormFieldProps {
    name: string;
    label?: string | React.ReactNode;
    help?: string | React.ReactNode;
    defaultValue?: any;
    value?: string | number;
    onChange?: (...args: any) => void;
    validateOnBlur?: boolean;
    onBlur?: (...args: any) => void;
    validateStatus?: string;
    validateIcon?: boolean;
    validateHelp?: string;
    className?: string;
    controlClassName?: string;
    readOnly?: boolean;
    disabled?: boolean;
    direction?: string;
    schemas?: object;
    maxLength?: number;
  }

  interface TreeData {
    title: string
    className?: string
    key: string
    children: TreeData[]
  }
  interface CommonInputProps {
    name?: string;
    className?: string;
    style?: React.CSSProperties;
    value?: string | number;
    defaultValue?: string | number;
    disabled?: boolean | Function;
    readOnly?: boolean;
    onChange?: (...args: any) => void;
    onKeyDown?: (...args: any) => void;
    onBlur?: (...args: any) => void;
  }

  interface InputProps extends CommonInputProps {
    size?: Size;
    type?: string;
    placeholder?: string;
    onPressEnter?: (...args: any) => void;
  }

  interface SelectProps {
    arrowRenderer?: () => void;
    autoBlur?: boolean;
    autoFocus?: boolean;
    backspaceRemoves?: boolean;
    className?: string;
    clearAllText?: string | React.ReactNode;
    clearRenderer?: () => void;
    clearValueText?: string | React.ReactNode;
    clearable?: boolean;
    closeOnSelect?: boolean;
    defaultValue?: any;
    deleteRemoves?: boolean;
    disabled?: boolean;
    escapeClearsValue?: boolean;
    isLoadingAtBottom?: boolean;
    bottomTextVisible?: boolean;
    id?: string;
    inputProps?: object;
    inputRenderer?: () => void;
    instanceId?: string;
    isLoading?: boolean;
    labelKey?: string;
    menuContainerStyle?: object;
    menuRenderer?: () => void;
    menuStyle?: object;
    multi?: boolean;
    name?: string;
    noResultsText?: string | React.ReactNode;
    onBlur?: () => void;
    onBlurResetsInput?: boolean;
    onChange?: (...args: any) => void;
    onClose?: () => void;
    onCloseResetsInput?: boolean;
    onFocus?: () => void;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    onInputChange?: (...args: any) => void;
    onInputKeyDown?: (e: any) => void;
    onMenuScrollToBottom?: () => void;
    onOpen?: () => void;
    onSelectResetsInput?: boolean;
    onValueClick?: () => void;
    openOnClick?: boolean;
    openOnFocus?: boolean;
    openOnClear?: boolean;
    optionComponent?: () => void;
    optionRenderer?: (option: any) => JSX.Element;
    options: any;
    prefixIcon?: React.ReactNode;
    placeholder?: string | React.ReactNode;
    bottomText?: string | React.ReactNode;
    resetValue?: any;
    scrollMenuIntoView?: boolean;
    searchable?: boolean;
    simpleValue?: boolean;
    size?: string;
    style?: object;
    tabIndex?: string | number;
    tabSelectsValue?: boolean;
    value?: any;
    valueComponent?: () => void;
    valueKey?: string;
    valueRenderer?: (option: object) => React.ReactNode;
    wrapperStyle?: object;
    children?: React.ReactNode;
  }

  interface SelectFieldProps extends SelectProps {
    label?: React.ReactNode;
    validateStatus?: string;
    validateIcon?: boolean;
    help?: string;
    schemas?: object;
  }

  class SelectField extends React.Component<SelectFieldProps, {}> { }

  export namespace Form {
    interface TextFieldProps extends CommonFormFieldProps {
      iconLeft?: string;
      iconRight?: string;
      placeholder?: string;
      validateOnChange?: boolean;
      validateOnBlur?: boolean;
      maxLength?: number;
    }
  }
  export interface BadgeProps {
    count?: number;
    children?: React.ReactNode;
    overflowCount?: number;
    status?: 'default' | 'success' | 'error' | 'warning' | 'white';
    type?: 'default' | 'collection' | 'dot';
    style?: Record<string, unknown>,
    text?: string,
    className?: string,

  }
  class Badge extends React.Component<BadgeProps, {}> {}

  interface BreadcrumbProps {
    className?: string;
  }
  class Breadcrumb extends React.Component<BreadcrumbProps, {}> {}
  // Breadcrumb.BreadcrumbItem

  class TextArea extends React.Component<{rows: string | number, name: string; placeholder: string, onChange: any, className?: string}, {}> {}
}
