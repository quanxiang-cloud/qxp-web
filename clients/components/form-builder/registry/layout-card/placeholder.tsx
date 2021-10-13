/**
 * feat: layout-card placeholder component in canvas builder
 */
import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Card } from 'antd';
import { values } from 'lodash';

import FieldRender from '@c/form-builder/components/field-render';
import DragDrop from '@c/form-builder/components/drag-drop';
import { StoreContext } from '@c/form-builder/context';
import { EmptyLayout } from '@c/form-builder/components/empty-layout';
import { getFieldId } from '@c/form-builder/utils/fields-operator';

function Placeholder(props: ISchema): JSX.Element {
  const [innerFields, setInnerFields] = React.useState<ISchema[]>([]);
  const store = useContext(StoreContext);

  const { title = '', properties } = props;
  const pid = getFieldId(props);

  React.useEffect(() => {
    setInnerFields(values(properties));
  }, [store.schema, store.flattenFields, properties]);

  return (
    <Card title={(
      <div>{title}</div>
    )}>
      <DragDrop id={pid} pid={pid} key={pid}>
        <>
          {!innerFields.length ?
            <EmptyLayout pid={pid} /> :
            <FieldRender schema={{ properties }} />
          }
        </>
      </DragDrop>
    </Card>
  );
}

Placeholder.isVirtualFieldComponent = true;

export default observer(Placeholder);
