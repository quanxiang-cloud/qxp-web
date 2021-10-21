import React, { useEffect, useRef } from 'react';

import PopConfirm from '@c/pop-confirm';
import Icon from '@c/icon';
import store from '../store';
import toast from '@lib/toast';

interface Props {
  onCancel?: () => void;
  onSubmit: (groupInfo: PageInfo) => Promise<unknown>;
}

function AddGroupPoper({ onCancel, onSubmit }: Props, ref: React.Ref<HTMLDivElement>) {
  const inputRef: any = useRef(null);

  const handleSubmit = async () => {
    if (!validateRepeat(inputRef.current.value)) {
      toast.error('分组名重复');
    } else if (inputRef.current.value) {
      onSubmit({ name: inputRef.current.value, id: '' });
    } else {
      toast.error('分组名不能为空');
    }
  };

  const validateRepeat = (value: string) => {
    return store.pageInitList.findIndex((pageInfo: PageInfo) => {
      if (pageInfo.menuType === 1) {
        return pageInfo.name === value;
      }
    }) === -1;
  };

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    if (inputRef) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={ref}
    >
      <PopConfirm
        content={
          (<div
            className="flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-body2 text-gray-600 mb-8">分组名称</div>
            <input
              name="name"
              ref={inputRef}
              className="h-32 w-316 mb-4 px-12 py-6 text-14 border outline-none border-blue-600 rounded-8 rounded-tl-none"
              maxLength={30}
            />
            <span className="text-caption text-gray-600">不超过30个字符</span>
          </div>)
        }
        onOk={handleSubmit}
        onCancel={() => {
          onCancel && onCancel();
        }}
      >
        <Icon
          name="create_new_folder"
          size={16}
          className='app-page-add-group block'
        />
      </PopConfirm>
    </div>

  );
}

export default React.forwardRef(AddGroupPoper);
