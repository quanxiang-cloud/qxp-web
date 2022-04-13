import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';

import toast from '@lib/toast';
import Icon from '@c/icon';
import Modal from '@c/modal';
import FileUploader from '@c/file-upload';
import { getFormTemplate, getTaskDetail, importForm } from '@c/task-lists/api';
import { multipleDownloadFile } from '@c/task-lists/unread-task-box/task-item';
import { subscribeStatusChange } from '@c/task-lists/utils';

import { StoreContext } from './context';

type Props = {
  onClose: () => void;
}

function ImportFormModal({ onClose }: Props): JSX.Element {
  const store = useContext(StoreContext);
  const [fileDetail, setfFleDetail] = useState<QXPUploadFileTask | undefined>(undefined);

  async function handSubmit(): Promise<void> {
    try {
      const taskID = await importForm({
        opt: 'minio',
        addr: fileDetail?.uid || '',
        size: fileDetail?.size || 0,
        value: {
          appID: store.appID,
          tableID: store.pageID,
        },
        title: `【${store.appName}-${store.pageName}】表单数据导入 `,
      });

      const [isFinish, isSuccess] = await subscribeStatusChange(taskID, '导入');
      if (isFinish) {
        isSuccess && store.setParams({});
        !isSuccess && toast.error('导入失败请稍后再试！');
      }
      setfFleDetail(undefined);
      onClose();
    } catch (err) {
      toast.error(err);
    }
  }

  function getTemplate(): void {
    getFormTemplate({
      value: { appID: store.appID, tableID: store.pageID },
      title: `【${store.appName}-${store.pageName}】表单模板导出`,
    }).then((taskID) => {
      getTaskDetail(taskID).then((res) => {
        if (res.status !== 2) {
          toast.error(res.result.title);
          onClose();
          return;
        }
        multipleDownloadFile(res.result.path);
      });
    });
  }

  function UploadDescription(): JSX.Element {
    return (
      <>
        <div className="my-4">点击或拖拽文件到此区域</div>
        <div className="text-gray-400">支持 20MB 以内的 xlsx 文件</div>
      </>
    );
  }

  return (
    <Modal
      title='上传表格'
      onClose={onClose}
      footerBtns={[
        {
          text: '取消',
          key: 'cancel',
          iconName: 'close',
          onClick: onClose,
        },
        {
          text: '确定',
          key: 'confirm',
          iconName: 'check',
          modifier: 'primary',
          forbidden: !fileDetail,
          onClick: () => handSubmit(),
        },
      ]}
    >
      <>
        <div className='rounded-12 rounded-tl-4 mx-16 my-20 flex items-center bg-blue-100 text-blue-600 py-10 px-16'>
          <Icon name='info' color='blue' className='w-16 h-16 fill-current' size={18} />
          <span className='ml-10 text-12'>
            支持：单行文本、多行文本、多选框等基础字段，以及人员选择器、部门选择器字段，其他字段暂不支持
          </span>
        </div>
        <FileUploader
          className='px-40 form-upload'
          uploaderDescription={<UploadDescription />}
          maxFileSize={20}
          accept={[
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ]}
          onFileDelete={setfFleDetail}
          onFileSuccess={(fileDetail: QXPUploadFileTask) => setfFleDetail(fileDetail)}
        />
        <p className="mt-12 select-none px-40 text-12">
          1.请先下载
          <span
            className="ml-6 text-blue-600 cursor-pointer hover:underline"
            onClick={getTemplate}
          >
            表格模板
          </span>
        </p>
        <p className="mt-4 mb-16 select-none px-40 text-12">2.表格填写完成后在此处上传</p>
      </>
      {/* {step === 2 && (
        <div className='flex flex-col items-center py-32 text-12 text-gray-600'>
          <Icon name='cloud-updone' size={32}></Icon>
          <div className='text-14 font-semibold my-4'>上传成功</div>
          <div>
                正在导入表格，查看
            <span
              className="mx-6 text-blue-600 cursor-pointer underline"
              onClick={() => {
                openUnreadTaskBox(true);
                onClose();
              }}
            >
                  导入结果
            </span>
                并关闭窗口
          </div>
          <div className='text-gray-400 mt-4'>上传成功</div>
        </div>
      )} */}
    </Modal>
  );
}

export default observer(ImportFormModal);

