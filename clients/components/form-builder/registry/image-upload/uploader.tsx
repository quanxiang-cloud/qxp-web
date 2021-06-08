import React, { useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Upload } from '@QCFE/lego-ui';

import toast from '@lib/toast';

import FileList from '@portal/modules/system-mgmt/send-message/filelist';

import './index.scss';

interface Props {
  multiple: boolean;
  fileList: FileInfo[];
}

interface FileInfo {
  url: string;
  filename: string;
  status?: 'success' | 'active' | 'exception';
  showProgress?: boolean;
  percentage?: number;
}

// @see: https://www.iana.org/assignments/media-types/media-types.xhtml#image
const acceptMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/tiff',
  'image/bmp',
  'image/svg+xml',
];

function Uploader(props: Props & ISchemaFieldComponentProps): JSX.Element {
  const { multiple } = props.props['x-component-props'];
  const initialValue = (props.value || []).map(({ label, value }: { label: string, value: string }) => ({
    filename: label,
    url: value,
  }));
  const [files, setFiles] = useState<FileInfo[]>(initialValue);

  const handleChangeFiles = (files: FileInfo[]) => {
    const curFiles = files.map(({ url, filename }) => ({ label: filename, value: url }));
    props.mutators.change(curFiles);
  };

  const addFile = (file: FileInfo) => setFiles((currentFiles) => ([...currentFiles, file]));
  const updateFile = (name: string, data: Partial<FileInfo>) => {
    setFiles((currentFiles) => {
      const curFile = currentFiles.find((f) => f.filename === name);
      Object.assign(curFile, data);
      return [...currentFiles];
    });
  };
  const deleteFile = (name: string) => {
    setFiles((prevFiles) => {
      const curFiles = prevFiles.filter((file) => file.filename !== name);
      setTimeout(() => handleChangeFiles(curFiles));
      return curFiles;
    });
  };

  // @ts-ignore
  const handleSuccess = (res) => {
    if (res.code == 200) {
      updateFile(res.data.filename, {
        filename: res.data.filename,
        url: res.data.url,
        percentage: 100,
        status: 'success',
        showProgress: false,
      });
      handleChangeFiles([...files, { filename: res.data.filename, url: res.data.url }]);
    } else {
      toast.error('上传失败');
    }
  };

  return (
    <div className="file-upload">
      <Upload
        headers={{ 'X-Proxy': 'API' }}
        multiple={Boolean(multiple)}
        action="/api/v1/fileserver/uploadFile"
        beforeUpload={(file) => {
          if (!acceptMimeTypes.includes(file.type)) {
            toast.error('暂不支持该图片类型');
            return false;
          }
          if (!multiple && files.length > 0) {
            toast.error('仅允许上传一张图片');
            return false;
          }
          if (file.size > 1024 * 1024 * 5) {
            toast.error('文件大小不能超过5M');
            return false;
          }
          if (files.find((f) => f.filename === file.name)) {
            toast.error('文件已存在，请勿重复上传');
            return false;
          }
          return true;
        }}
        onStart={(file) => {
          addFile({
            filename: file.name,
            url: '',
            percentage: 0,
            showProgress: true,
            status: 'active',
          });
        }}
        onProgress={(step, file) => {
          // @ts-ignore
          const percent = typeof step.percent === 'number' ? Math.round(step.percent) : 0;
          updateFile(file.name, {
            percentage: percent,
            showProgress: true,
          });
        }}
        onSuccess={handleSuccess}
        onError={(err) => toast.error(err.message)}
      >
        <div className="uploader flex flex-col items-center justify-center text-center">
          <p className="text-black-100 hover:text-black-200">点击或拖动文件上传，最大5M</p>
          <p className="text-gray-400">(图片类型：jpg、jpeg、png、gif、bmp、svg、tiff)</p>
        </div>
      </Upload>
      <div className="uploaded-files">
        <FileList
          files={files.map((itm) => ({
            file_url: itm.url,
            file_name: itm.filename,
            percent: itm.percentage || 100,
            showProgress: itm.showProgress,
            status: itm.status || 'success',
          }))}
          deleteFiles={deleteFile}
          candownload
        />
      </div>
    </div>
  );
}

Uploader.isFieldComponent = true;

export default Uploader;
