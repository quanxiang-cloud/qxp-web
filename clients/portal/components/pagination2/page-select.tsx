import React, { useState } from 'react';
import { Icon } from '@QCFE/lego-ui';

interface PageSelectProps {
  value: number;
  pageSizeOptions?: number[];
  onChange?: (val: number) => void;
}

const PageSelect = (props: PageSelectProps) => {
  const { value, pageSizeOptions, onChange } = props;
  const [isShow, setIsShow] = useState(false);
  const pageOptions = pageSizeOptions ? pageSizeOptions : [10, 20, 30, 50];

  const clickPage = (val: number) => {
    setIsShow(false);
    onChange && onChange(val);
  };

  return (
    <div className="flex items-center relative">
      <div className="mr-dot-6 text-1-dot-2">每页</div>
      <div className="w-32 h-2-dot-8 border border-gray-300 rounded-r-dot-8
      rounded-tl-dot-2 rounded-bl-dot-8 px-1-dot-2 text-1-dot-2 flex items-center"
      onClick={() => setIsShow(!isShow)}
      >
        <div className="mr-2">{value} 条</div>
        {isShow ? <Icon name="caret-up" /> :
          <Icon name="caret-down" />}
      </div>
      {
        isShow &&
        (<ul className="absolute top-12 right-0 bg-white w-32 border border-gray-300">
          {
            pageOptions.map((num) => {
              return (
                <li
                  key={num}
                  onClick={() => clickPage(num)}
                  className="h-2-dot-8 px-1-dot-2 py-dot-2 text-1-dot-2 cursor-pointer
        text-center leading-2-dot-8 hover:bg-blue-light">{num} 条</li>
              );
            })
          }
        </ul>)
      }
    </div>
  );
};

export default PageSelect;
