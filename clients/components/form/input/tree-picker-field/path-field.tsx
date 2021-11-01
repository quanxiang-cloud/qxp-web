import React, { MouseEventHandler } from 'react';
import { Input } from 'antd';

interface Props {
  path: string;
  value: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  appendix?: JSX.Element | null;
}

function PathField({ path, value, appendix, onClick }: Props): JSX.Element {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      className="w-full cursor-pointer"
      title={path}
    >
      <div title={path}>
        <Input
          className="text-area-input flex flex-col"
          value={path}
        />
      </div>
      <Input value={value} className="hidden h-0" />
      {appendix && (<>{appendix}</>)}
    </div>
  );
}

export default PathField;
