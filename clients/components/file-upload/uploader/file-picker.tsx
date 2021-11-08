import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

type FilePickerProps = {
  name?: string;
  accept?: string;
  iconName?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onSelectFiles?:(files: File[]) => void;
}

function FilePicker({
  style,
  accept,
  children,
  className,
  description,
  multiple = false,
  disabled = false,
  name = 'qxp-file-picker',
  iconName = 'backup',
  onSelectFiles,
}: FilePickerProps): JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onFileInputChange(e: ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (files) {
      onSelectFiles?.(Array.from(files));
    }
    (fileInputRef?.current as HTMLInputElement).value = '';
  }

  // File drag event handler
  function onFileDrop(e: DragEvent): void {
    e.preventDefault();
    setIsDragging(false);
    const { files } = e.dataTransfer;
    onSelectFiles?.(Array.from(files));
    (fileInputRef?.current as HTMLInputElement).value = '';
  }

  const events = disabled ?
    {} :
    {
      onDrop: onFileDrop,
      onDragOver: (e:DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
      },
      onDragLeave: (e:DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
      },
    };

  return (
    <div
      style={style}
      role="button"
      className={cs(
        'qxp-file-picker relative border-1 border-dashed border-gray-300 rounded-8 mb-10',
        'flex justify-center items-center flex-col bg-transparent text-gray-600',
        className, {
          'opacity-50': disabled,
          'qxp-file-picker-dragover': isDragging,
        })}
    >
      <input
        {...events}
        type="file"
        name={name}
        ref={fileInputRef}
        multiple={multiple}
        disabled={disabled}
        accept={accept?.toString()}
        onChange={onFileInputChange}
        className={cs('w-full h-full z-10 opacity-0 cursor-pointer',
          {
            'cursor-not-allowed': disabled,
          })}
      />
      {children || (
        <div className={cs('w-full h-full absolute inset-0 flex flex-col justify-center items-center')}>
          <Icon className="upload-icon text-gray-600 flex-shrink-0" name={iconName} size={24} />
          <span className="text-12 text-center select-none">{description || '点击或拖拽上传文件'}</span>
        </div>
      )}
    </div>
  );
}

export default FilePicker;
