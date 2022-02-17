import React, { useContext, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';

import Select from '@c/select';
import FlowCtx from '@flow/flow-context';
import { getFormFieldSchema } from '@flow/content/editor/forms/api';
import { schemaToMap } from '@lib/schema-convert';
import { getSchemaFields, isAdvancedField } from '../utils';

interface Props {
  tableId: string;
  onChangeField: (field_id: string) => void;
  className?: string;
}

function SelectTargetFields({ tableId, onChangeField }: Props): JSX.Element | null {
  const { appID } = useContext(FlowCtx);
  const { data: targetSchema } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appID], getFormFieldSchema, {
    enabled: !!appID && !!tableId,
  });
  const targetSchemaMap = useMemo(() => schemaToMap(targetSchema), [targetSchema]);
  const hasComplexType = Object.values(targetSchemaMap).some((field)=> isAdvancedField(field.type, field.componentName));
  const fields = useMemo(()=> {
    // primitive type before complex type
    return getSchemaFields(Object.values(targetSchemaMap), {
      noSystem: true,
      excludeComps: ['serial'],
      sort: true,
    });
  }, [targetSchema]);

  useEffect(()=> {
    if (!hasComplexType) {
      onChangeField('');
    }
  }, [hasComplexType]);

  console.log('target fields: ', targetSchemaMap);

  if (!tableId || !hasComplexType) {
    return null;
  }

  return (
    <div className="inline-flex items-center mt-20">
      <span className="text-body mr-10">选择相关数据:</span>
      <Select
        options={fields}
        placeholder="选择字段"
        value={tableId}
        onChange={onChangeField}
      />
    </div>
  );
}

export default SelectTargetFields;
