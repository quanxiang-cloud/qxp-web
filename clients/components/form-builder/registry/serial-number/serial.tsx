import React from 'react';

interface Props {
  value?: string;
}

export default function Serial({ value }: Props): JSX.Element {
  return (
    <span>{value || '未配置流水号'}</span>
  );
}
