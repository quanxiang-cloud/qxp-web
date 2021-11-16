import React, { useCallback } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { Store } from '@polyApi/components/object-editor/store';
import { Row } from '@polyApi/components/object-editor/';
import BodyEditor from '@polyApi/components/body-editor';
import Formular from './formular';

type Props = ISchemaFieldComponentProps & {

}

const columnsDataIndexToOmit = ['required', 'desc'];

export default function EndOutputEditor(props: Props): JSX.Element {
  const ruleRender = useCallback((
    { name, parentPath, current$, index, type }: Row<POLY_API.ObjectSchema>,
    store$: Store<POLY_API.ObjectSchema>,
  ) => {
    return (
      <Formular
        customRules={[]}
        defaultValue={''}
        onChange={() => {}}
      />
    );
  }, []);

  const columns = [{
    title: '运算公式',
    dataIndex: 'rule',
    render: ruleRender,
  }];

  return (
    <BodyEditor
      {...props}
      initialValue={props.initialValue?.data}
      columnsDataIndexToOmit={columnsDataIndexToOmit}
      extraColumns={columns}
    />
  );
}
