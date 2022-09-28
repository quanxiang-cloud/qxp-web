import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { UnionColumn } from 'react-table';

import { FilePicker, FileList } from '@c/file-upload';
import { isMacosX } from '@lib/utils';
import Icon from '@c/icon';
import toast from '@lib/toast';
import Modal from '@c/modal';
import Table from '@c/table';
import RadioGroup from '@c/radio/group';
import Radio from '@c/radio';

import { FileUploadStatus } from '../type';
import { exportEmployeesFail } from '../utils';
import { getUserTemplate, importTempFile, resetUserPWD, downloadTempFile } from '../api';
import { SendMessage, sendMsgOption } from './reset-password-modal';
import { SEND_MAP } from './edit-employees-modal';

const columns: UnionColumn<any>[] = [
  {
    Header: '姓名',
    id: 'userName',
    accessor: 'userName',
  },
  {
    Header: '手机号',
    id: 'phone',
    accessor: 'phone',
  },
  {
    Header: '邮箱',
    id: 'email',
    accessor: 'email',
  },
  {
    Header: '原因',
    id: 'remarks',
    accessor: 'remarks',
  },
];

type UploadRes = {
  status: FileUploadStatus;
  successTotal: number;
  failTotal: number;
};

type ButtonStatus = 0 | 1;

interface Props {
  currDepId: string;
  closeModal(): void;
}

const BYTE_SIZE = isMacosX ? 1000 : 1024;
const MAX_SIZE = (BYTE_SIZE ** 2) * 5;

function ImportEmployeesModal({ currDepId, closeModal }: Props): JSX.Element {
  const [fileList, setFileList] = useState<File[]>([]);
  const [checkWay, setCheckWay] = useState<{ sendChannel: number; sendTo: string }>({ sendChannel: 0, sendTo: '' });
  const [uploadStatus, setUploadStatus] = useState<UploadRes>({
    status: FileUploadStatus.init,
    successTotal: 0,
    failTotal: 0,
  });
  const [failUsers, setFailUsers] = useState([]);
  const [successUsersId, setSuccessUsersId] = useState<string[]>([]);
  const [btnStatus, setBtnStatus] = useState<ButtonStatus>(0);
  const [importLoading, setImportLoading] = useState(false);

  const tempMutation = useMutation(getUserTemplate, {
    onSuccess: (data) => {
      const { fileURL } = data;
      downEmployeesTemp(fileURL, '模板文件.xlsx');
    },
    onError: () => {
      toast.error('操作失败');
    },
  });

  const uploadMutation = useMutation(importTempFile, {
    onSuccess: (res) => {
      if (res && res.code === 0) {
        toast.success('操作成功');
        const { data } = res;
        if (data) {
          const { failTotal, failUsers, successTotal, success } = data;
          let status: FileUploadStatus = FileUploadStatus.init;
          if (failTotal > 0 && successTotal === 0) {
            status = FileUploadStatus.fail;
          } else if (failTotal === 0) {
            status = FileUploadStatus.success;
          } else if (failTotal > 0 && successTotal > 0) {
            status = FileUploadStatus.depSuccess;
          } else {
            status = FileUploadStatus.success;
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
        closeModal();
      } else {
        toast.error(res?.msg || '操作失败！');
      }
      setImportLoading(false);
    },
  });

  const resetMutation = useMutation(resetUserPWD, {
    onSuccess: () => {
      toast.success('操作成功！');
      closeModal();
    },
    onError: () => {
      toast.error('操作失败！');
      closeModal();
    },
  });

  function downEmployeesTemp(url: string, fileName: string): void {
    const aElem = document.createElement('a');
    document.body.appendChild(aElem);
    aElem.href = url;
    aElem.download = fileName;
    aElem.click();
    document.body.removeChild(aElem);
  }

  function beforeUpload(file: File): boolean | void {
    const { size } = file;
    if (size > 1024 * 1024 * 5) {
      toast.error('文件过大，超过 5M 不能上传！');
      return;
    }
    setFileList([file]);
    return false;
  }

  function onFileSelect(files: File[]): boolean | void {
    const file = files[0];
    if (file.size > MAX_SIZE) {
      toast.error('文件过大，超过 5M 不能上传！');
      return;
    }
    setFileList([file]);
  }

  function downTemp(): void {
    // tempMutation.mutate();
    downloadTempFile()
      .then((res: any)=>{
        const { fileName, data } = res;
        const aElem = document.createElement('a');
        document.body.appendChild(aElem);
        aElem.setAttribute('href', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + encodeURIComponent(data));
        aElem.download = fileName;
        aElem.click();
        document.body.removeChild(aElem);
      }).catch((error)=>{
        toast.error(error);
      });
  }

  function deleteUploadFile(delFile: QXPUploadFileBaseProps): void {
    const newFileList = fileList.filter((file) => file.name !== delFile.name);
    setFileList(newFileList);
  }

  function importEmployeesTemp(): void {
    if (fileList.length === 0) {
      toast.error('请上传文件');
      return;
    }
    const params = {
      depID: currDepId,
      file: fileList[0],
    };
    setImportLoading(true);
    uploadMutation.mutate(params);
  }

  function exportEmployees(): void {
    exportEmployeesFail(columns, failUsers, '失败人员列表.xlsx');
  }

  function changeCheckbox(val: any): void {
    // ignore
    const checkedWay = {
      sendChannel: val || 0,
      sendTo: SEND_MAP[val] || '',
    };
    setCheckWay(checkedWay);
  }

  function handleSubmit(): void {
    if (checkWay && !checkWay.sendChannel) {
      toast.error('请选择发送方式');
      return;
    }
    const sendMessage: SendMessage[] = successUsersId.map((id) => {
      return {
        userID: id,
        ...checkWay,
      };
    });
    resetMutation.mutate({ userIDs: successUsersId, sendMessage });
    closeModal();
  }

  return (
    <>
      <Modal
        title="excel 批量导入成员"
        className="static-modal"
        onClose={closeModal}
        footerBtns={
          uploadStatus.status !== FileUploadStatus.fail ?
            [
              {
                text: '取消',
                key: 'cancel',
                iconName: 'close',
                onClick: closeModal,
              },
              btnStatus === 0 ? {
                text: '确定导入',
                key: 'confirm',
                iconName: 'check',
                modifier: 'primary',
                loading: importLoading,
                onClick: importEmployeesTemp,
              } : {
                text: '确定',
                key: 'confirm',
                iconName: 'check',
                modifier: 'primary',
                onClick: handleSubmit,
              },
            ] : []
        }
      >
        <div className="w-full text-14 p-20">
          {uploadStatus.status === FileUploadStatus.fail && (
            <div className="text-red-600 mb-24 font-semibold flex items-center">
              <Icon
                size={16}
                name="sms_failed"
                className="mr-8"
                style={{ color: '#ca2621' }}
              />
              <span>导入失败 {uploadStatus.failTotal} 条数据。</span>
            </div>
          )}
          {uploadStatus.status === FileUploadStatus.success && (
            <div className="text-green-600 mb-24 font-semibold flex items-center">
              <Icon
                size={16}
                name="playlist_add_check"
                className="mr-8"
                style={{ color: '#2191ca' }}
              />
              <span>导入成功 {uploadStatus.successTotal} 条数据。</span>
            </div>
          )}
          {uploadStatus.status === FileUploadStatus.depSuccess && (
            <div className="text-yellow-600 mb-24 font-semibold flex items-center">
              <Icon
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
              <div className="w-full group">
                <FilePicker
                  className="p-20"
                  accept=".xlsx, .xls"
                  multiple={false}
                  onSelectFiles={onFileSelect}
                  description="点击或拖拽单个文件到至该区域。支持xls、xlsx格式"
                />
                <div className="mt-8 flex flex-col">
                  <FileList
                    deleteFileItem={deleteUploadFile}
                    files={fileList.map((file) => ({
                      uid: file.name,
                      type: file.type,
                      name: file.name,
                      size: file.size,
                    }))}
                  />
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
                <li>2. 上传填写正确的企业通讯录导入模版</li>
              </ul>
            </div>
          )}
          {
            [FileUploadStatus.success, FileUploadStatus.depSuccess].includes(
              uploadStatus.status,
            ) && (
              <div>
                <p className="text-gray-600 font-semibold mt-24 mb-16">
                  接下来选择：
                </p>
                <p className="text-14 py-8">向已导入的员工发送随机密码</p>
                <RadioGroup onChange={changeCheckbox}>
                  {sendMsgOption.map((option) => {
                    return (
                      <Radio
                        className="mr-8"
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    );
                  })}
                </RadioGroup>
              </div>
            )
          }
          {
            [FileUploadStatus.depSuccess, FileUploadStatus.fail].includes(
              uploadStatus.status,
            ) && (
              <div>
                <div className="mb-8 flex items-center">
                  <p className="text-gray-600 font-semibold">失败原因：</p>
                  <span
                    onClick={exportEmployees}
                    className="text-blue-600 cursor-pointer"
                  >
                    下载失败列表
                  </span>
                </div>
                <div className="qxp-table flex w-full mb-24">
                  <Table
                    className="text-14 table-full"
                    rowKey="phone"
                    data={failUsers}
                    columns={columns}
                  />
                </div>
              </div>
            )
          }
        </div>
      </Modal>
    </>
  );
}

export default ImportEmployeesModal;
