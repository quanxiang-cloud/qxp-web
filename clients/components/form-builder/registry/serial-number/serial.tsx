import React, { useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useQuery } from 'react-query';
import { getSerial } from './api';

function SerialNumber(p: ISchemaFieldComponentProps): JSX.Element {
  const { appID, id } = p.props['x-component-props'];
  const fieldID = id;
  const { isLoading, data } = useQuery<any, Error>(
    [appID, fieldID],
    () => getSerial(appID, fieldID),
  );
  useEffect(()=>{
    p.mutators.change(data?.value);
  }, [data]);

  return (
    <p>{p.value}</p>
  );
}

SerialNumber.isFieldComponent = true;

export default SerialNumber;
