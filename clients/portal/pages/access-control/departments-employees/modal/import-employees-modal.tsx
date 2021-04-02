import React, { useState } from 'react';
import { useMutation } from 'react-query';
import classnames from 'classnames';
import {
  Modal,
  CheckboxGroup,
  Checkbox,
  Table,
  Upload,
  Message,
} from '@QCFE/lego-ui';

import SvgIcon from '@c/icon';
import Button from '@c/button';
import {
  getUserTemplate,
  importTempFile,
  resetUserPWD,
} from '@net/corporate-directory';

import { FileUploadStatus } from '../type';

type UploadRes = {
  status: FileUploadStatus;
  successTotal: number;
  failTotal: number;
};

type ButtonStatus = 0 | 1;

type CheckedWay = {
  sendEmail: -1 | 1;
  sendPhone: -1 | 1;
};

interface Props {
  currDepId: string;
  closeModal(): void;
}

export default function ImportEmployeesModal({
  currDepId,
  closeModal,
}: Props) {
  const [fileList, setFileList] = useState<File[]>([]);
  const [checkWay, setCheckWay] = useState<CheckedWay>({
    sendPhone: -1,
    sendEmail: -1,
  });
  const [uploadStatus, setUploadStatus] = useState<UploadRes>({
    status: FileUploadStatus.init,
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
          let status: FileUploadStatus = FileUploadStatus.init;
          if (failTotal > 0 && successTotal === 0) {
            status = FileUploadStatus.fail;
          } else if (failTotal === 0 && successTotal > 0) {
            status = FileUploadStatus.success;
          } else if (failTotal > 0 && successTotal > 0) {
            status = FileUploadStatus.depSuccess;
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
        Message.error(res?.msg || '操作失败！');
      }
    },
  });

  const resetMutation = useMutation(resetUserPWD, {
    onSuccess: (data) => {
      if (data && data.code === 0) {
        Message.success('操作成功！');
      } else {
        Message.error('操作失败！');
      }
      closeModal();
      setFileList([]);
      setBtnStatus(0);
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

  const columns: Columns = [
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
    if (size > 1024 * 1024 * 5) {
      Message.error('文件过大，超过 5M 不能上传！');
      return;
    }
    setFileList([file]);
    return false;
  };

  const downTemp = () => {
    tempMutation.mutate();
  };

  const delFile = (Index: number) => {
    const newFileList = fileList.filter((item, index) => index !== Index);
    setFileList(newFileList);
  };

  const importFile = () => {
    if (fileList.length === 0) {
      Message.error('请上传文件');
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

  const exportCourseExcel = (
    headers: Columns,
    data: any[],
    fileName: string
  ) => {
    const _headers = headers
      .map((item, i) =>
        Object.assign(
          {},
          {
            key: item.key,
            title: item.title,
            position: String.fromCharCode(65 + i) + 1,
          }
        )
      )
      .reduce(
        (prev: any, next: any) =>
          Object.assign({}, prev, {
            [next.position]: { key: next.key, v: next.title },
          }),
        {}
      );

    const _data = data
      .map((item: any, i: any) =>
        headers.map((key: any, j: any) =>
          Object.assign(
            {},
            {
              content: item[key.key],
              position: String.fromCharCode(65 + j) + (i + 2),
            }
          )
        )
      )
      .reduce((prev: any, next: any) => prev.concat(next))
      .reduce(
        (prev: any, next: any) =>
          Object.assign({}, prev, { [next.position]: { v: next.content } }),
        {}
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

  const handleSubmit = () => {
    if (checkWay && checkWay.sendEmail === -1 && checkWay.sendPhone === -1) {
      Message.error('请选择发送方式');
      return;
    }
    setUploadStatus({
      status: 0,
      successTotal: 0,
      failTotal: 0,
    });
    resetMutation.mutate({ userIDs: successUsersId, ...checkWay });
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
        visible
        title="excel 批量导入成员"
        className="static-modal"
        onCancel={closeBefore}
        footer={
          uploadStatus.status !== FileUploadStatus.fail ? (
            <div className="flex items-center">
              <Button
                icon={<SvgIcon name="close" size={20} className="mr-8" />}
                className="mr-20"
                onClick={closeBefore}
              >
                取消
              </Button>
              {btnStatus === 0 ? (
                <Button
                  className="bg-black-900"
                  textClassName="text-white"
                  icon={
                    <SvgIcon
                      name="check"
                      type="light"
                      size={20}
                      className="mr-8"
                    />
                  }
                  onClick={importFile}
                >
                  确定导入
                </Button>
              ) : (
                <Button
                  className="bg-black-900"
                  textClassName="text-white"
                  icon={
                    <SvgIcon
                      name="check"
                      type="light"
                      size={20}
                      className="mr-8"
                    />
                  }
                  onClick={handleSubmit}
                >
                  确定
                </Button>
              )}
            </div>
          ) : null
        }
      >
        <div className="w-full text-14">
          {uploadStatus.status === FileUploadStatus.fail && (
            <div className="text-red-600 mb-24 font-semibold flex items-center">
              <SvgIcon
                size={16}
                name="sms_failed"
                className="mr-8"
                style={{ color: '#ca2621' }}
              />
              <span>导入失败 {uploadStatus.failTotal} 条数据。</span>
            </div>
          )}
          {uploadStatus.status === FileUploadStatus.success && (
            <div className="text-green-600 mb-24 font-semibold">
              <SvgIcon
                size={16}
                name="playlist_add_check"
                className="mr-8"
                style={{ color: '#2191ca' }}
              />
              <span>导入成功 {uploadStatus.successTotal} 条数据。</span>
            </div>
          )}
          {uploadStatus.status === FileUploadStatus.depSuccess && (
            <div className="text-yellow-600 mb-24 font-semibold">
              <SvgIcon
                size={16}
                name="priority_high"
                className="mr-8"
                style={{ color: '#d0a406' }}
              />
              <span>
                数据导入完成，导入成功 {uploadStatus.successTotal}{' '}
                数据，导入失败 {uploadStatus.failTotal} 数据。
              </span>
            </div>
          )}
          {uploadStatus.status === FileUploadStatus.init && (
            <div className="text-gray-600">
              <p className="py-8">上传单个 excel 文件</p>
              <div className="w-full">
                <Upload
                  style={{ width: '100%' }}
                  disabled={fileList.length === 0 ? false : true}
                  beforeUpload={beforeUpload}
                  accept=".xlsx, .xls"
                >
                  <div
                    className={classnames(
                      'w-full h-86 border rounded-8 border-dashed border-gray-700',
                      'flex flex-col items-center justify-center hover:border-red-600'
                    )}
                  >
                    <SvgIcon
                      size={16}
                      name="cloud_upload"
                      style={{ color: '#64748B' }}
                    />
                    <p>点击或拖拽单个文件到至该区域。支持xls、xlsx格式</p>
                  </div>
                </Upload>
                <div className="mt-8 flex flex-col">
                  {fileList.map((file, index) => {
                    return (
                      <div
                        key={index}
                        className="px-8 py-4 cursor-pointer flex
                        items-center justify-between bg-blue-100"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-16 h-16 bg-blue-600 icon-border-radius
                          flex items-center justify-center mr-8"
                          >
                            <SvgIcon size={12} name="book" type="light" />
                          </div>
                          <span>{file.name}</span>
                        </div>
                        <SvgIcon
                          size={16}
                          name="restore_from_trash"
                          onClick={() => delFile(index)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <ul className="text-gray-600 mt-24">
                <li>
                  1. 点击下载
                  <span
                    onClick={downTemp}
                    className="text-blue-600 cursor-pointer"
                  >
                    企业通讯录导入模版
                  </span>
                </li>
                <li>2. 上传填写正确的企业通讯录导入模版。</li>
              </ul>
            </div>
          )}
          {[FileUploadStatus.success, FileUploadStatus.depSuccess].includes(
            uploadStatus.status
          ) && (
            <div>
              <p className="text-gray-600 font-semibold mt-24 mb-16">
                接下来选择：
              </p>
              <p className="text-14 py-8">向已导入的员工发送随机密码</p>
              <CheckboxGroup
                name="states"
                onChange={(value: string[]) => changeCheckbox(value)}
              >
                <Checkbox value="email">通过邮箱</Checkbox>
                <Checkbox value="phone">通过短信</Checkbox>
              </CheckboxGroup>
            </div>
          )}
          {[FileUploadStatus.depSuccess, FileUploadStatus.fail].includes(
            uploadStatus.status
          ) && (
            <div>
              <div className="mb-8 flex items-center">
                <p className="text-gray-600 font-semibold">失败原因：</p>
                <span
                  onClick={downFailData}
                  className="text-blue-600 cursor-pointer"
                >
                  下载失败列表
                </span>
              </div>
              <div className="qxp-table flex w-full mb-24">
                <Table
                  className="text-14 table-full"
                  rowKey="phone"
                  dataSource={failUsers}
                  columns={columns}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
