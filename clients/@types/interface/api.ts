
import React from 'react'
import '../../../node_modules/@QCFE/types/index'

export interface IResponse {
  code: number;
  data: unknown;
  msg?: string;
}

export interface UploadProps {
  name?: string;
  disabled?: boolean;
  directory?: boolean;
  actions?: string;
  data?: any;
  headers?: any;
  accept?: string;
  multiple?: boolean;
  withCredentials?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

class Upload extends React.Component<UploadProps, {}> { }