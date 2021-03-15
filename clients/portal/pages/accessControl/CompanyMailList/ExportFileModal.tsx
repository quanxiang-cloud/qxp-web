import React, { useState } from 'react'
import classnames from 'classnames'
import useCss from 'react-use/lib/useCss'
import { Modal, CheckboxGroup, Checkbox, GridTable, Upload, Icon } from '@QCFE/lego-ui'

import { Button } from '@portal/components/Button'
interface ExportFileModalProps {
  visible: boolean
  closeModal(): void
  okModal(): void
}

export const ExportFileModal = ({ visible, closeModal, okModal }: ExportFileModalProps) => {
  const dataSource = [
    {
      name: '张三',
      reason: '人员手机号或邮箱不能为空！',
    },
  ]

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '原因',
      dataIndex: 'reason',
    },
  ];

  const setFileStatus = (fileId: any, fileStatus: any) => {
    // this.setState(prevState => ({
    //   files: Object.assign({}, prevState.files, {
    //     [fileId]: Object.assign({}, prevState.files[fileId], fileStatus),
    //   }),
    // }));
  };

  const uploadProps = {
    name: 'foo',
    action: '/api/upload',
    data: { a: 1, b: 2 },
    multiple: true,
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload(file: any) {
      console.log('beforeUpload', file.name);
    },
    onStart(file: any) {
      console.log('onStart', file.name);
      setFileStatus(file.uid, {
        name: file.name,
        showProgress: true,
        showFile: false,
        percentage: 0,
        status: 'active',
      });
    },
    onSuccess(res: any, file: any) {
      console.log('onSuccess', file.name);
      setFileStatus(file.uid, {
        showProgress: false,
        showFile: true,
        percentage: 100,
        status: 'active',
      });
    },
    onProgress(step: any, file: any) {
      // const percent = isNumber(step.percent) ? Math.round(step.percent) : 0;
      // console.log('onProgress', percent, file.name);
      // setFileStatus(file.uid, {
      //   percentage: percent,
      //   status: 'active',
      // });
    },
    onError(err: any, res: any, file: any) {
      console.log('onError', err, file.name);
      setFileStatus(file.uid, {
        showProgress: true,
        showFile: false,
        status: 'exception',
      });
    }
  };

  return (
    <Modal
      title="excel 批量导入成员"
      visible={visible}
      width={632}
      onOk={closeModal}
      onCancel={okModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={
              <img
                className="w-1-dot-2 h-1-dot-2 pr-dot-4"
                src="./dist/images/icon_error.svg"
                alt="icon_error"
              />
            }
            onClick={closeModal}
          >
            取消
          </Button>
          <div className="px-2"></div>
          <Button
            className="bg-black"
            textClassName="text-white"
            icon={
              <img
                className="w-1-dot-2 h-1-dot-2 pr-dot-4"
                src="./dist/images/icon_true.svg"
                alt="icon_true"
              />
            }
            onClick={okModal}
          >
            确定导入
          </Button>
        </div>
      }
    >
      <div className="text-dot-7">
        <div className="text-DC2626 font-semibold flex items-center">
          <Icon size={16} name="upload" type="coloured" />
          <span>数据导入完成，已成功导入 0 数据，失败 0 数据。</span>
        </div>
        <div className="text-16A34A font-semibold">
          <Icon size={16} name="upload" type="coloured" />
          <span>数据导入完成，已成功导入 0 数据，失败 0 数据。</span>
        </div>
        <div className="text-D97706 font-semibold">
          <Icon size={16} name="upload" type="coloured" />
          <span>数据导入完成，已成功导入 1 数据，失败 1 数据。</span>
        </div>
        <div>
          <p className="py-dot-4">选择 excel</p>
          <div className="w-full">
            <Upload
              // {...uploadProps}
              style={{width: '100%'}}
            >
              <div className={classnames('w-full h-4-dot-3 border rounded-dot-4 border-dashed border-CBD5E1 flex flex-col items-center justify-center', useCss({
                '&:hover': {
                    'border-color': 'red'
                }
              }))}>
                <Icon size={16} name="upload" type="coloured" />
                <p>点击或拖拽单个文件到至该区域</p>
              </div>
            </Upload>
            <div className="mt-dot-4 flex flex-col">
              <div className={classnames('px-dot-4 py-dot-2 cursor-pointer flex items-center justify-between', useCss({
                '&:hover': {
                  'background-color': '#F0F6FF' 
                }
              }))}>
                <div className="flex items-center">
                  <Icon size={16} name="upload" type="coloured" />
                  <span>text.zip</span>
                </div>
                <Icon size={16} name="upload" type="coloured" />
              </div>
            </div>
        </div>
        </div>
        <div>
          <p className="text-dot-7 py-dot-4">向员工发送密码</p>
          <CheckboxGroup
            name="states"
            onChange={(value, name) => {
              console.log({ value, name })
            }}
          >
            <Checkbox value={1}>通过邮箱</Checkbox>
            <Checkbox value={2}>通过短信</Checkbox>
          </CheckboxGroup>
        </div>
        <div>
          <p className="py-dot-4">选择 excel</p>
          {/* <div className="">
            <img className="w-1-dot-2 h-1-dot-2 pr-dot-4" src="./dist/images/icon_error.svg" alt="icon_error" />
            <div>点击或拖拽文件到该区域</div>
            </div> */}
          <div className="demo-wrapper upload-demo">
            {/* <Upload
              {...this.uploaderProps}
              ref={n => {
                this.uploader = n;
              }}
            >
              <div className="drag-panel">
                <Icon size={32} name="upload" type="coloured" />
                <p className="drag-title">单击或拖动文件到此区域进行上传</p>
                <p>支持单个或批量上传,请不要上传要求格式之外的任何文件</p>
              </div>
            </Upload>
            <div className="file-list">
              {Object.keys(files).map(fileId => {
                if (!files[fileId]) return null;
                if (files[fileId].showProgress) {
                  return this.renderProgress(fileId);
                }
                if (files[fileId].showFile) {
                  return this.renderFileItem(fileId);
                }
                return null;
              })}
            </div> */}
          </div>
        </div>
        <ul>
          <li>
            1. 如果需要将excel的成员数据导入到不同部门，需要先建立部门。去{' '}
            <span
              className={classnames(
                'text-375FF3',
                useCss({
                  '&': {
                    cursor: 'pointer',
                  },
                }),
              )}
            >
              添加
            </span>
          </li>
          <li>
            2. 点击下载{' '}
            <span
              className={classnames(
                'text-375FF3',
                useCss({
                  '&': {
                    cursor: 'pointer',
                  },
                }),
              )}
            >
              企业通讯录导入模版
            </span>
          </li>
          <li>3. 上传填写正确的企业通讯录导入模版。</li>
        </ul>
        <div>
          <div className="py-dot-4 flex items-center">
            <p className="text-475569 font-semibold">失败原因：</p>
            <span
              className={classnames(
                'text-375FF3',
                useCss({
                  '&': {
                    cursor: 'pointer',
                  },
                }),
              )}
            >
              下载失败列表
            </span>
          </div>
          <GridTable rowKey="id" dataSource={dataSource} columns={columns} />
        </div>
      </div>
    </Modal>
  )
}
