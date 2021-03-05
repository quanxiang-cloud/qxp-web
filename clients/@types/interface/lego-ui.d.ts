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
}
