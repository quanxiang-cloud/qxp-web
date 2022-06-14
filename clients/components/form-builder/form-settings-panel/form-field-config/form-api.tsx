import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import APISelector from '@polyApi/nodes/forms/request-config/api-selector';
import './index.scss';
const FormApi = (props: ISchemaFieldComponentProps): ReactElement=>{
  const { appID } = useParams<{ appID: string }>();
  return (
    <div className='flex-1' style={{ width: 250 }}>
      <APISelector
        appID={appID}
        initRawApiPath={props.value}
        setApiPath={(path, method) =>props.mutators.change([path, method])}
        className="form-api-select"
        simpleMode={true}
        onClear={()=>props.mutators.change(undefined)}
      />
    </div>
  );
};
FormApi.isFieldComponent = true;
export default FormApi;
