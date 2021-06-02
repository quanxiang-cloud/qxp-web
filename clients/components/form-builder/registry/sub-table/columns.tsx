import { useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

function Columns(props: ISchemaFieldComponentProps) {
  useEffect(() => {
    props.mutators.change(props.initialValue);
  }, []);

  return null;
}

Columns.isFieldComponent = true;

export default Columns;
