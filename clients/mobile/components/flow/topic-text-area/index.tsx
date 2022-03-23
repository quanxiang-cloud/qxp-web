import React, { useEffect, useRef, useState } from 'react';

import Icon from '@m/qxp-ui-mobile/icon';
import Button from '@m/qxp-ui-mobile/button';
import { unitToPx } from '@m/qxp-ui-mobile/utils/format/unit';
import FileUploader, { FileUploaderInstance } from '@m/components/file-uploader';
import { defaultMaxFileSize } from '@m/components/file-uploader/use-uploader';

import './index.scss';

export default function TopicTextArea(): JSX.Element {
  const nativeTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');
  useEffect(() => {
    const textArea = nativeTextAreaRef.current;
    if (!textArea) return;
    let height = textArea.scrollHeight;
    const computedStyle = window.getComputedStyle(textArea);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    height = Math.max(height, lineHeight);
    height = Math.min(height, unitToPx('1.4rem'));
    textArea.style.height = `${height}px`;
  }, [value]);

  const uploaderRef = useRef<FileUploaderInstance>(null);

  return (
    <div className='topic-text-area-wrapper safe-area-bottom bg-white text-secondary body2 flex flex-col'>
      <div className='textarea-files-wrapper overflow-scroll flex-1 pt-12 pl-12 pr-12'>
        <textarea
          ref={nativeTextAreaRef}
          maxLength={200}
          onChange={(event) => setValue(event.target.value)}
          className='text-secondary body1 topic-text-area w-full h-auto'
          placeholder='发表评论'
        />
        <FileUploader
          multiple
          maxFileSize={defaultMaxFileSize}
          showInput={false}
          ref={uploaderRef}
        />
      </div>

      <div className='topic-text-area-bottom flex items-center'>
        <div className='relative pointer-4 ml-12' style={{
          width: '.28rem',
          height: '.28rem',
        }}>
          <Icon name='attachment' size='.28rem' style={{ padding: '.04rem' }} />
          <input
            type='file'
            multiple
            className='opacity-0 w-full h-full absolute top-0 left-0'
            onChange={(e) => uploaderRef?.current?.onInputChange?.(e)}
          />
        </div>
        <div className='text-placeholder flex-1 text-right mr-8'>{value.length}/200</div>
        <Button theme='tertiary' className='body1 topic-btn-send mr-12' loadingText='发送中'>
          发送
        </Button>
      </div>
    </div>
  );
}
