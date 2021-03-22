import React, { useState } from 'react';
import { useMutation } from 'react-query';
import classnames from 'classnames';
import { Modal, CheckboxGroup, Checkbox, Table, Upload, Icon, Message } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import { getUserTemplate, importTempFile } from './api';
interface ExportFileModalProps {
  visible: boolean;
  currDepId: string;
  closeModal(): void;
  okModal(ids: string[], val: CheckedWay): void;
}

type UploadRes = {
  status: 0 | 1 | 2 | 3; // 0 无状态 1成功 2部分成功 3失败
  successTotal: number;
  failTotal: number;
};

type ButtonStatus = 0 | 1;

type Column = {
  title: string;
  key: string;
  dataIndex: string;
};

type CheckedWay = {
  sendEmail: -1 | 1;
  sendPhone: -1 | 1;
};

export const ExportFileModal = ({
  visible,
  currDepId,
  closeModal,
  okModal,
}: ExportFileModalProps) => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [checkWay, setCheckWay] = useState<CheckedWay>({
    sendPhone: -1,
    sendEmail: -1,
  });
  const [uploadStatus, setUploadStatus] = useState<UploadRes>({
    status: 0,
    successTotal: 0,
    failTotal: 0,
  });
  const [failUsers, setFailUsers] = useState([]);
  const [successUsersId, setSuccessUsersId] = useState<string[]>([]);
  const [btnStatus, setBtnStatus] = useState<ButtonStatus>(0);
  const tempMutation = useMutation(getUserTemplate, {
    onSuccess: (url) => {
      if (url) {
        downFile(url, '模板文件.xlsx');
      }
    },
  });

  const uploadMutation = useMutation(importTempFile, {
    onSuccess: (res) => {
      if (res && res.code === 0) {
        Message.success('操作成功');
        const { data } = res;
        if (data) {
          const { failTotal, failUsers, successTotal, success } = data;
          let status: 0 | 1 | 2 | 3 = 0;
          if (failTotal > 0 && successTotal === 0) {
            status = 3;
          } else if (failTotal === 0 && successTotal > 0) {
            status = 1;
          } else if (failTotal > 0 && successTotal > 0) {
            status = 2;
          }
          setBtnStatus(1);
          setFailUsers(failUsers);
          setSuccessUsersId(success);
          setUploadStatus({
            status,
            failTotal,
            successTotal,
          });
        }
      } else {
        Message.error('操作失败！');
      }
    },
  });

  const downFile = (url: string, fileName: string) => {
    const aElem = document.createElement('a');
    document.body.appendChild(aElem);
    aElem.href = url;
    aElem.download = fileName;
    aElem.click();
    document.body.removeChild(aElem);
  };

  const columns: Column[] = [
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '原因',
      dataIndex: 'remarks',
      key: 'remarks',
    },
  ];

  const beforeUpload = (file: File) => {
    const { size } = file;
    if (size > 1024 * 1024 * 2) {
      Message.error('文件过大，超过 2M 不能上传！');
    }
    setFileList([file]);
    return false;
  };

  // 下载模板
  const downTemp = () => {
    tempMutation.mutate();
  };

  // 删除文件
  const delFile = (Index: number) => {
    const newFileList = fileList.filter((item, index) => index !== Index);
    setFileList(newFileList);
  };

  // import file
  const importFile = () => {
    if (fileList === []) {
      return;
    }
    const params = {
      depID: currDepId,
      file: fileList[0],
    };
    uploadMutation.mutate(params);
  };

  const downFailData = () => {
    exportCourseExcel(columns, failUsers, '失败人员列表.xlsx');
  };

  // 导出课程Excel表格数据
  const exportCourseExcel = (headers: Column[], data: any[], fileName: string) => {
    const _headers = headers
      .map((item: Column, i: number) =>
        Object.assign(
          {},
          {
            key: item.key,
            title: item.title,
            position: String.fromCharCode(65 + i) + 1,
          },
        ),
      )
      .reduce(
        (prev: any, next: any) =>
          Object.assign({}, prev, {
            [next.position]: { key: next.key, v: next.title },
          }),
        {},
      );

    const _data = data
      .map((item: any, i: any) =>
        headers.map((key: any, j: any) =>
          Object.assign(
            {},
            {
              content: item[key.key],
              position: String.fromCharCode(65 + j) + (i + 2),
            },
          ),
        ),
      )
      .reduce((prev: any, next: any) => prev.concat(next))
      .reduce(
        (prev: any, next: any) => Object.assign({}, prev, { [next.position]: { v: next.content } }),
        {},
      );
    const output = Object.assign({}, _headers, _data);
    const outputPos = Object.keys(output);
    const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
    const wb = {
      SheetNames: ['mySheet'],
      Sheets: {
        mySheet: Object.assign({}, output, {
          '!ref': ref,
          '!cols': [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }],
        }),
      },
    };
    import('xlsx').then(({ default: XLSX }) => {
      XLSX.writeFile(wb, fileName);
    });
  };

  const changeCheckbox = (val: string[]) => {
    const checkedWay: CheckedWay = {
      sendEmail: -1,
      sendPhone: -1,
    };
    if (val.length > 0) {
      val.includes('email') && (checkedWay.sendEmail = 1);
      val.includes('phone') && (checkedWay.sendPhone = 1);
    }
    setCheckWay(checkedWay);
  };

  const okSendModal = () => {
    setUploadStatus({
      status: 0,
      successTotal: 0,
      failTotal: 0,
    });
    setFileList([]);
    setBtnStatus(0);
    okModal(successUsersId, checkWay);
  };

  const closeBefore = () => {
    setUploadStatus({
      status: 0,
      successTotal: 0,
      failTotal: 0,
    });
    setFileList([]);
    setBtnStatus(0);
    closeModal();
  };

  return (
    <>
      <Modal
        title="excel 批量导入成员"
        visible={visible}
        className="static-modal"
        onCancel={closeBefore}
        footer={
          uploadStatus.status !== 3 ? (
            <div className="flex items-center">
              <Button icon={<Icon name="close" className="mr-dot-4" />} onClick={closeBefore}>
                取消
              </Button>
              <div className="px-2"></div>
              {btnStatus === 0 ? (
                <Button
                  className="bg-black"
                  textClassName="text-white"
                  icon={<Icon name="check" className="mr-dot-4" />}
                  onClick={importFile}
                >
                  确定导入
                </Button>
              ) : (
                <Button
                  className="bg-black"
                  textClassName="text-white"
                  icon={<Icon name="check" className="mr-dot-4" />}
                  onClick={okSendModal}
                >
                  确定
                </Button>
              )}
            </div>
          ) : null
        }
      >
        <div className="w-full text-1-dot-4">
          {uploadStatus.status === 3 && (
            <div className="text-red-600 font-semibold flex items-center">
              <Icon
                size={16}
                name="information"
                color={{
                  primary: '#ca2621',
                  secondary: '#ea4641',
                }}
              />
              <span>导入失败 {uploadStatus.failTotal} 条数据。</span>
            </div>
          )}
          {uploadStatus.status === 1 && (
            <div className="text-green-600 font-semibold">
              <Icon
                size={16}
                name="cloud"
                color={{
                  primary: '#2191ca',
                  secondary: '#41b1ea',
                }}
              />
              <span>导入成功 {uploadStatus.successTotal} 条数据。</span>
            </div>
          )}
          {uploadStatus.status === 2 && (
            <div className="text-yellow-600 font-semibold">
              <Icon
                size={16}
                name="exclamation"
                color={{
                  primary: '#d0a406',
                  secondary: '#f0c426',
                }}
              />
              <span>
                数据导入完成，导入成功 {uploadStatus.successTotal} 数据，导入失败{' '}
                {uploadStatus.failTotal} 数据。
              </span>
            </div>
          )}
          {uploadStatus.status === 0 && (
            <div className="text-gray-600">
              <p className="py-dot-4">上传单个 excel 文件</p>
              <div className="w-full">
                <Upload
                  style={{ width: '100%' }}
                  disabled={fileList.length === 0 ? false : true}
                  beforeUpload={beforeUpload}
                >
                  <div
                    className={classnames(
                      'w-full h-8-dot-6 border rounded-dot-8 border-dashed broder-gray-700',
                      'flex flex-col items-center justify-center hover:border-red-600',
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
                        className="px-dot-4 py-dot-2 cursor-pointer flex
                        items-center justify-between hover-bg-color"
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
              <ul className="text-gray-600">
                <li>
                  1. 点击下载
                  <span onClick={downTemp} className="text-blue-600 cursor-pointer">
                    企业通讯录导入模版
                  </span>
                </li>
                <li>2. 上传填写正确的企业通讯录导入模版。</li>
              </ul>
            </div>
          )}
          {[1, 2].includes(uploadStatus.status) && (
            <div>
              <p className="text-gray-600 font-semibold">接下来选择：</p>
              <p className="text-1-dot-4 py-dot-4">向已导入的员工发送随机密码</p>
              <CheckboxGroup name="states" onChange={(value: string[]) => changeCheckbox(value)}>
                <Checkbox value="email">通过邮箱</Checkbox>
                <Checkbox value="phone">通过短信</Checkbox>
              </CheckboxGroup>
            </div>
          )}
          {[2, 3].includes(uploadStatus.status) && (
            <div>
              <div className="py-dot-4 flex items-center">
                <p className="text-gray-600 font-semibold">失败原因：</p>
                <span onClick={downFailData} className="text-blue-600 cursor-pointer">
                  下载失败列表
                </span>
              </div>
              <div className="qxp-table flex w-full">
                <Table rowKey="phone" dataSource={failUsers} columns={columns} />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
