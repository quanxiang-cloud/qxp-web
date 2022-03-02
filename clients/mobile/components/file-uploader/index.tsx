import React, { useImperativeHandle, CSSProperties } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';

import { Props } from '@m/qxp-ui-mobile';
import Icon from '@m/qxp-ui-mobile/icon';

import FileList from '../file-list';
import { useUploader, UseUploaderProps } from './use-uploader';

import './index.scss';
interface FileUploaderProps extends UseUploaderProps, Props {
  showInput?: boolean;
  desc?: string;
  disabled?: boolean;
  // To fix eslint error, override following params
  multiple: boolean;
  maxFileSize?: number;
  defaultFiles?: LabelValue[];
  className?: string;
  style?: CSSProperties;
}

export type FileUploaderInstance = {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
};

const FileUploader = React.forwardRef<FileUploaderInstance, FileUploaderProps>(
  (props: FileUploaderProps, ref): JSX.Element => {
    const { showInput = true } = props;
    const { storeFiles, upload, retry, remove } = useUploader(props);

    function onInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
      const files = e.target.files;
      if (files) {
        upload(Array.from(files));
      }
    }
    useImperativeHandle(ref, () => ({
      onInputChange,
    }));

    function renderInput(): JSX.Element {
      return (
        <div className='file-uploader-input-wrapper body2 text-secondary relative mt-12'>
          <div className='file-uploader-input flex justify-center items-center'>
            <Icon name='attach_file' size='.24rem' className='mr-8'/>
            <p className='truncate'>{props.desc ? props.desc : '点击上传附件'}</p>
          </div>
          <input
            className='opacity-0 w-full h-full absolute'
            type='file'
            multiple={props.multiple}
            onChange={onInputChange}>
          </input>
        </div>
      );
    }

    return (
      <div className={props.className} style={props.style}>
        <FileList
          className='bg-blue-100 body2 text-primary'
          files={toJS(storeFiles)}
          canDownload rightIcon={props.disabled ? undefined : 'delete'}
          rightIconClick={remove}
          retry={retry}
        />
        {showInput && !props.disabled && renderInput()}
      </div>
    );
  });

export default observer(FileUploader);
