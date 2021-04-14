import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import { StoreContext } from '../context';

function FormFieldWrapper(props: ISchemaFieldComponentProps) {
  const store = React.useContext(StoreContext);
  // const schemaProps = useSchemaProps();
  const ref = React.useRef<HTMLDivElement>(null);

  // const borderColor = store.activeFieldWrapperName == props.name ? 'red' : 'blue';

  function handleFieldClick() {
    store.setActiveFieldWrapperKey(props.name);
  }

  return (
    <div
      ref={ref}
      className="relative"
      // style={{ border: `1px solid ${borderColor}`, padding: 10 }}
      onClick={handleFieldClick}
    >
      {/* todo support re-range fields */}
      {/* <div className="absolute top-0 right-0 transform-y-10 z-10">
        <Icon name="delete" />
        <Icon name="content_copy" />
        <Icon name="drag_indicator" />
      </div> */}
      {props.children}
    </div>
  );
}

FormFieldWrapper.isVirtualFieldComponent = true;

export default FormFieldWrapper;
