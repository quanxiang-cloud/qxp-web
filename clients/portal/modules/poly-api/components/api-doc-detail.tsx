import React from 'react';
import cs from 'classnames';

interface Props {
  method?: string;
  url?: string;
  identifier?: string;
  className?: string;
}

export default function ApiDocDetail(
  { method = '', url = '', identifier = '', className }: Props,
): JSX.Element {
  return (
    <div className={cs('flex items-center justify-between overflow-auto', className)}>
      请求方法：<span className="text-green-600 mr-8">{method}</span>
      接口路径：<span className="flex-2 truncate mr-8" title={url}>{url}</span>
      API标识：<span className="flex-1 truncate">{identifier}</span>
    </div>
  );
}
