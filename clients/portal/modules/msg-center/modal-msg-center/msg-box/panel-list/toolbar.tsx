import React, { useState, forwardRef, useImperativeHandle } from 'react';

import Checkbox from '@c/checkbox';
import Button from '@c/button';

interface Props {
  canIUseReadBtn: boolean;
  canIUseDelBtn: boolean;
  handleAllChecked: () => void;
  handleAllUnchecked: () => void;
  handleCheckedReaded: () => void;
  handleDeleteMessage: () => void;
  handleAllReaded: () => void;
}

function Toolbar({
  canIUseDelBtn,
  canIUseReadBtn,
  handleAllChecked,
  handleAllUnchecked,
  handleCheckedReaded,
  handleAllReaded,
  handleDeleteMessage,
}: Props, ref: any): JSX.Element {
  const [checkedAll, setCheckedAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      setCheckedAll(checked: boolean) {
        setCheckedAll(checked);
      },
      setIndeterminate(checked: boolean) {
        setIndeterminate(checked);
      },
    };
  });

  return (
    <div className="flex items-center justify-between mb-16">
      <div className="flex items-center pl-8">
        <Checkbox
          checked={checkedAll}
          indeterminate={indeterminate}
          onChange={(e) => {
            setCheckedAll(e.target.checked);
            if (e.target.checked) {
              handleAllChecked();
            } else {
              handleAllUnchecked();
            }
          }}
          className='mr-16'
        />
        <Button
          forbidden={!canIUseReadBtn}
          onClick={() => handleCheckedReaded()}
          className='mr-16'
        >
        标为已读
        </Button>
        <Button
          forbidden={!canIUseDelBtn}
          onClick={() => handleDeleteMessage()}
        >
        删除
        </Button>
      </div>
      <Button
        className="bg-gray-700"
        onClick={() => handleAllReaded()}
        modifier="primary"
        iconName="done_all"
      >
      全部已读
      </Button>
    </div>
  );
}

export default forwardRef(Toolbar);
