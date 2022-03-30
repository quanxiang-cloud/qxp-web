import React, { useContext, useMemo } from 'react';
import { useQuery } from 'react-query';

import { Select } from '@one-for-all/headless-ui';
import FlowCtx from '@flow/flow-context';
import { getFormFieldSchema } from '@flow/content/editor/forms/api';
import { schemaToMap } from '@lib/schema-convert';
import { getSchemaFields } from '../utils';

interface Props {
  tableId: string;
  onChangeField: (field_id: string) => void;
  fieldId?: string;
  className?: string;
}

function SelectTargetFields({ tableId, fieldId, onChangeField }: Props): JSX.Element | null {
  const { appID } = useContext(FlowCtx);
  const { data: targetSchema } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appID], getFormFieldSchema, {
    enabled: !!appID && !!tableId,
  });
  const targetSchemaMap = useMemo(() => schemaToMap(targetSchema), [targetSchema]);
  const fields = useMemo(()=> {
    // merge all normal fields into one group before complex fields
    return getSchemaFields(Object.values(targetSchemaMap), {
      noSystem: true,
      excludeComps: ['serial'],
      sort: true,
      mergeNormal: true,
    });
  }, [targetSchema]);

  if (!tableId) {
    return null;
  }

  return (
    <div className="inline-flex items-center mt-20">
      <span className="text-body mr-10">选择相关数据:</span>
      <Select
        options={fields}
        placeholder="选择字段"
        value={fieldId}
        onChange={onChangeField}
      />
    </div>
  );
}

export default SelectTargetFields;
