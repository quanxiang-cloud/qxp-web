import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import CSwitch from '@c/switch';

export default function Switch(props: ISchemaFieldComponentProps) {
  return (
    <CSwitch value={props.value} options={props.dataSource} onChange={props.onChange} />
  );
}
