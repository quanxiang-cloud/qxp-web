import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import classnames from 'classnames';
import useCss from 'react-use/lib/useCss';
import { Modal, CheckboxGroup, Checkbox, GridTable, Upload, Icon, Message } from '@QCFE/lego-ui';

import { Button } from '@portal/components/Button';
import { getUserTemplate, importTempFile, FileParams } from './api';
interface ExportFileModalProps {
  visible: boolean;
  closeModal(): void;
  okModal(): void;
}

export const ExportFileModal = ({ visible, closeModal, okModal }: ExportFileModalProps) => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [isAllowUpload, setAllowUpload] = useState<boolean>(false);
  const tempMutation = useMutation(getUserTemplate, {
    onSuccess: (url) => {
      if (url) {
        downFile(url, '模板文件.xlsx');
      }
    },
  });

  const uploadMutation = useMutation(importTempFile, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const downFile = (url: string, fileName: string) => {
    const aElem = document.createElement('a');
    document.body.appendChild(aElem);
    aElem.href = url;
    aElem.download = fileName; // 'xxx.xls'
    aElem.click();
    document.body.removeChild(aElem);
  };

  const dataSource = [
    {
      name: '张三',
      reason: '人员手机号或邮箱不能为空！',
    },
  ];

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
    name: 'file',
    action: '/api/org/v1/importFile',
    data: {
      depID: '5ad55834-a03e-4705-9214-edd5de15cf7c',
    },
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Token': 'Bear M2MWZDKZNJQTYTM5YY01MJLMLWE4MGQTMJE3MTLKYMUYNMI5',
      'X-Proxy': 'API',
    },
    beforeUpload: (file: File) => {
      console.log('beforeUpload', file.name);
    },
    onStart: (file: File) => {
      console.log('onStart', file.name);
      // setFileStatus(file.uid, {
      //   name: file.name,
      //   showProgress: true,
      //   showFile: false,
      //   percentage: 0,
      //   status: 'active',
      // });
    },
    onSuccess: (res: Response, file: File) => {
      console.log(file);
      console.log('onSuccess', file.name);
      // setFileStatus(file.uid, {
      //   showProgress: false,
      //   showFile: true,
      //   percentage: 100,
      //   status: 'active',
      // });
    },
    // onProgress(step: any, file: File) {
    //   // const percent = isNumber(step.percent) ? Math.round(step.percent) : 0;
    //   // console.log('onProgress', percent, file.name);
    //   // setFileStatus(file.uid, {
    //   //   percentage: percent,
    //   //   status: 'active',
    //   // });
    // },
    onError(err: any, res: Response, file: File) {
      console.log('onError', err, file.name);
      // setFileStatus(file.uid, {
      //   showProgress: true,
      //   showFile: false,
      //   status: 'exception',
      // });
    },
  };

  const beforeUpload = (file: File) => {
    console.log(file);
    const { size } = file;
    if (size > 1024 * 1024 * 2) {
      Message.error('文件过大，超过 2M 不能上传！');
    }
    setFileList([file]);
    setAllowUpload(true);
    return false;
  };

  // 下载模板
  const downTemp = () => {
    tempMutation.mutate();
  };

  // 删除文件
  const delFile = (Index: number) => {
    let newFileList = fileList.filter((item, index) => index !== Index);
    setFileList(newFileList);
    setAllowUpload(false);
  };

  // import file
  const importFile = () => {
    console.log(fileList);
    if (fileList === []) {
      return;
    }
    const params = {
      depID: '5ad55834-a03e-4705-9214-edd5de15cf7c',
      file: fileList[0],
    };
    console.log(params);
    uploadMutation.mutate(params);
  };

  return (
    <>
      <Modal
        title="excel 批量导入成员"
        visible={true}
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
              onClick={importFile}
            >
              确定导入
            </Button>
          </div>
        }
      >
        <div className="text-dot-7">
          {/* <div className="text-DC2626 font-semibold flex items-center">
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
          </div> */}
          <div>
            <p className="py-dot-4">上传单个 excel 文件</p>
            <div className="w-full">
              <Upload
                style={{ width: '100%' }}
                disabled={isAllowUpload}
                beforeUpload={beforeUpload}
              >
                <div
                  className={classnames(
                    'w-full h-4-dot-3 border rounded-dot-4 border-dashed border-CBD5E1',
                    'flex flex-col items-center justify-center',
                    useCss({
                      '&:hover': {
                        'border-color': 'red',
                      },
                    }),
                  )}
                >
                  <Icon size={16} name="upload" type="coloured" />
                  <p>点击或拖拽单个文件到至该区域。支持xls、xlsx格式</p>
                </div>
              </Upload>
              <div className="mt-dot-4 flex flex-col">
                {fileList.map((file, index) => {
                  return (
                    <div
                      key={index}
                      className="px-dot-4 py-dot-2 cursor-pointer flex items-center justify-between hover-bg-color"
                    >
                      <div className="flex items-center">
                        <Icon size={16} name="upload" type="coloured" />
                        <span>{file.name}</span>
                      </div>
                      <Icon
                        size={16}
                        name="upload"
                        type="coloured"
                        onClick={() => delFile(index)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <ul>
            <li>
              1. 点击下载{' '}
              <span onClick={downTemp} className="text-375FF3 cursor-pointer">
                企业通讯录导入模版
              </span>
            </li>
            <li>2. 上传填写正确的企业通讯录导入模版。</li>
          </ul>
          <div>
            <p className="text-dot-7 py-dot-4">向员工发送密码</p>
            <CheckboxGroup
              name="states"
              onChange={(value, name) => {
                console.log({ value, name });
              }}
            >
              <Checkbox value={1}>通过邮箱</Checkbox>
              <Checkbox value={2}>通过短信</Checkbox>
            </CheckboxGroup>
          </div>
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
    </>
  );
};
