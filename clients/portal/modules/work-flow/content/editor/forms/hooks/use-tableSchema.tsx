import { useContext, useMemo } from 'react';
import FlowTableContext from '@flow/content/editor/forms/flow-source-table';
import FlowContext from '@flow/flow-context';
import { useQuery } from 'react-query';
import { getFormFieldSchema } from '@flow/content/editor/forms/api';
import { getSchemaFields, getSelectColumns, isAdvancedField, targetFieldExcludeComps } from '../utils';
import { get } from 'lodash';
import { schemaToMap } from '@lib/schema-convert';

const useTableSchema = (dataID: string)=>{
  const { tableID: tableId } = useContext(FlowTableContext);
  const { appID } = useContext(FlowContext);
  const { data: targetSchema } = useQuery(['GET_TARGET_TABLE_SCHEMA', tableId, appID], getFormFieldSchema, {
    enabled: !!appID && !!tableId,
  });
  const targetSchemaMap = useMemo(() => schemaToMap(targetSchema), [targetSchema]);
  const { data: relatedTableSchema, isLoading: loadingRelatedTable } = useQuery([
    'GET_TABLE_SCHEMA', dataID, appID,
  ], ({ meta }) => {
    const selectField = targetSchemaMap[dataID || ''];
    const compName = selectField?.componentName;
    if (compName === 'subtable') {
      const { tableID, appID, subordination } = selectField['x-component-props'] || {};
      if (subordination === 'foreign_table') {
        return getFormFieldSchema({ queryKey: ['', tableID, appID], meta });
      }
    }
    if (compName === 'associateddata') {
      const { appID, associationTableID } = get(selectField, 'x-component-props', {}) as any;
      return getFormFieldSchema({ queryKey: ['', associationTableID, appID], meta });
    }
  }, { enabled: !!dataID && !!appID });

  const fields = useMemo(()=> {
    // merge all normal fields into one group before complex fields
    return getSchemaFields(Object.values(targetSchemaMap), {
      noSystem: true,
      excludeComps: ['serial'],
      sort: true,
      mergeNormal: true,
    });
  }, [targetSchema]);
  function getTargetFieldList(): LabelValue[] {
    const selectField = targetSchemaMap[dataID || ''];

    if (selectField) {
      const { componentName } = selectField;
      if (componentName === 'associatedrecords') {
        const columns = get(selectField, 'x-component-props.columns', []);
        return Object.entries(get(selectField, 'x-component-props.associatedTable.properties', {}))
          .filter((properties: [string, any]) => (
            getSelectColumns(properties, columns, targetFieldExcludeComps) ),
          )
          .map(([field_id, conf]: [string, any]) => {
            return {
              label: conf.title || field_id,
              value: field_id,
            };
          });
      }

      if (componentName === 'associateddata') {
        return getSchemaFields(Object.values(schemaToMap(relatedTableSchema)), {
          noSystem: true,
          excludeComps: targetFieldExcludeComps,
        });
      }

      if (componentName === 'subtable') {
        const sub = get(selectField, 'x-component-props.subordination');
        const subItems = sub === 'foreign_table' ? get(relatedTableSchema, 'properties') :
          get(selectField, 'items.properties');

        return Object.entries(subItems || {})
          .filter(([, conf]: [string, any]) => {
            return !get(conf, 'x-internal.isSystem') && !isAdvancedField(conf.type, conf['x-component']);
          })
          .map(([field_id, conf]: [string, any]) => {
            return {
              label: conf.title || field_id,
              value: field_id,
            };
          });
      }
    }
    return getSchemaFields(Object.values(targetSchemaMap), {
      noSystem: true,
      excludeComps: targetFieldExcludeComps,
    });
  }
  return {
    fields,
    loadingRelatedTable,
    getTargetFieldList,
  };
};

export default useTableSchema;
