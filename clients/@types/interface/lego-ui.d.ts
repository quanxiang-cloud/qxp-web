declare module '@QCFE/lego-ui' {
  interface ModalProps {
    title?: string | React.ReactNode
    type?: string
    closable?: boolean
    width?: number | string
    height?: number | string
    okText?: string
    okType?: string
    onOk?: () => void
    onOpen?: () => void
    cancelText?: string
    cancelType?: string
    onCancel?: () => void
    footer?: string | React.ReactNode | null
    mask?: boolean
    maskClosable?: boolean
    maskStyle?: React.CSSProperties
    escClosable?: boolean
    bodyStyle?: React.CSSProperties
    style?: React.CSSProperties
    className?: string
    draggable?: boolean
    defaultLeft?: string | number
    defaultTop?: string | number
    resizable?: boolean
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    appendToBody?: boolean
    confirmLoading?: boolean
    showConfirmLoading?: boolean
    content?: React.ReactNode
    onAsyncOk?: (...args: any) => any
    visible?: boolean
  }

  interface TableProps extends GridTableProps<unknown> {
    rowKey: string
    dataSource?: unknown[]
    columns: unknown[]
    rowSelection?: {
      selectedRowKeys: string[]
      onChange?: (selectedRowKeys: string[], selectedRows: any[]) => void
      getCheckboxProps?: (record: unknown) => unknown
    }
    emptyText: JSX.Element
    onRow: (
      record: any,
    ) => {
      onClick?: Function
      onDoubleClick?: Function
      onMouseEnter?: Function
      onMouseLeave?: Function
      onContextMenu?: Function
    }
  }

  interface UploadProps {
    name?: string
    disabled?: boolean
    directory?: boolean
    action?: string
    data?: any
    headers?: Record<string, any>
    accept?: string
    multiple?: boolean
    withCredentials?: boolean
    className?: string
    style?: Record<string, any>
    onStart?: (file: File) => void
    onProgress?: (res: Response, file: File) => void
    onSuccess?: (file: File) => void
    onError?: (err: Error, res: Response, file: File) => void
    beforeUpload?: (file: File) => void
  }

  class Upload extends React.Component<UploadProps, {}> {}
}
