import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Checkbox } from '@QCFE/lego-ui';
// import Checkbox from '@c/checkbox';
import Button from '@c/button';

import styles from '../index.module.scss';

const Toolbar = forwardRef((props: any, ref) => {
  const [checkAll, setCheckAll] = useState(false);
  const [interm, setInterm] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      allcheck(checked: boolean) {
        setCheckAll(checked);
      },
      interm(checked: boolean) {
        setInterm(checked);
      },
    };
  });

  return (
    <div className={styles.toolbar}>
      <div className={`flex align-center flex-1 ${styles.toolbar_content}`}>
        <Checkbox
          checked={checkAll}
          indeterminate={interm}
          onChange={(e) => {
            setCheckAll(e.target.checked);
            if (e.target.checked) {
              props.setAllChecked();
            } else {
              props.setAllUnchecked();
            }
          }}
          className='mr-16'
        />
        <Button
          forbidden={!props.canIUseReadBtn}
          onClick={props.handleCheckedReaded}
          className='mr-16'
        >
          标为已读
        </Button>
        <Button
          forbidden={!props.canIUseDelBtn}
          onClick={props.handleDeleteMessage}
        >
          删除
        </Button>
      </div>
      <div>
        <Button
          className="bg-gray-700"
          onClick={props.handleAllReaded}
          modifier="primary"
          iconName="done_all"
        >
          全部已读
        </Button>
      </div>
    </div>
  );
});

export default Toolbar;
