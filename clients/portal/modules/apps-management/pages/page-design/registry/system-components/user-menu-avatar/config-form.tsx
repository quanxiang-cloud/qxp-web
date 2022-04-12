import React from 'react';

interface Props {
  className?: string;
}

export const DEFAULT_CONFIG: Props = {};

function ConfigForm(props: Props) {
  return (
    <div>
      内部组件暂时不支持属性配置
    </div>
  );
}

export default ConfigForm;
