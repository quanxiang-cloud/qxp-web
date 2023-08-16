/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import React, { useContext, useState, Ref, CSSProperties, useEffect } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { usePopper } from 'react-popper';
import { useClickAway } from 'react-use';
import fp from 'lodash/fp';
import {
  DragDropContext, Droppable, Draggable, DropResult, DraggingStyle, NotDraggingStyle,
} from 'react-beautiful-dnd';
import { useFormEffects, FormEffectHooks } from '@formily/antd';

import Icon from '@c/icon';
import toast from '@lib/toast';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';
import { StoreContext } from '@c/form-builder/context';
import { generateRandomFormFieldID, numberTransform } from '@c/form-builder/utils';
import { FieldConfigContext } from '@c/form-builder/form-settings-panel/form-field-config/context';

import { SUB_TABLE_TYPES_SCHEMA_MAP, SUB_TABLE_TYPES } from '../constants';
import schemaToFields from '@lib/schema-convert';
import { getTableSchema } from '@lib/http-client-form';
import { Cascader } from 'antd';
import Toggle from '@c/toggle';

const { onFieldValueChange$ } = FormEffectHooks;

interface Option {
  label: string;
  value: string;
  schema: ISchema;
}

interface Field extends Option {
  sort: number;
}

function getItemStyle(draggableStyle?: DraggingStyle | NotDraggingStyle): CSSProperties {
  return {
    userSelect: 'none',
    cursor: 'default',
    ...draggableStyle,
  };
}

function SubTableSchema(props: ISchemaFieldComponentProps): JSX.Element {
  const store = useContext(StoreContext);
  const { actions } = useContext(FieldConfigContext);
  const [currentFieldLabel, setCurrentFieldLabel] = useState('添加');
  const [currentFieldValue, setCurrentFieldValue] = useState<string>('');
  const [referenceElRef, setReferenceElRef] = useState<HTMLDivElement>();
  const [popperElRef, setPopperElRef] = useState(null);
  const [fieldSelectorShow, setFieldSelectorShow] = useState(false);
  const [rowLimit, setRowLimit] = useState<'multiple' | 'single'>('multiple');
  const popperRef = usePopper(referenceElRef, popperElRef, {
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }],
    placement: 'bottom-start',
  });

  const { schema } = useContext(StoreContext);
  const {
    subOptionsSchema: _subOptionsSchema,
    subAssociatedFields: _subAssociatedFields,
    subOptionsChecked: _subOptionsChecked,
    subSchemaOptions: _subSchemaOptions,
    associatedFieldID: _associatedFieldID,
    subTableID: _subTableID,
  } = props?.initialValue?.['x-component-props'] || {};
  const [associatedFields, setAssociatedFields] = useState<any>([]);
  const [subOptionsSchema, setSubOptionsSchema] = useState<any>(_subOptionsSchema || {});
  const [subSchemaOptions, setSubSchemaOptions] = useState<any>(_subSchemaOptions || []);
  const [subOptionsChecked, setSubOptionsChecked] = useState<any>(_subOptionsChecked || {});
  const [subAssociatedFields, setSubAssociatedFields] = useState<any>(_subAssociatedFields || []);
  const [associatedFieldID, setAssociatedFieldID] = useState(_associatedFieldID || undefined);
  const [subTableID, setSubTableID] = useState<any>( _subTableID || undefined);
  const [initAssociatedFieldsFlag, setInitAssociatedFieldsFlag] = useState(false);

  useEffect(() => {
    actions.getFieldState('rowLimit', (state) => {
      setRowLimit(state.value);
    });
    getAssociatedTable();
  }, []);

  useEffect(() => {
    if (currentFieldValue === 'aggregationrecords') {
      setCurrentFieldLabel('添加');
      setCurrentFieldValue('');
    }
    onUpdateFields(schemaList.filter(
      (field) => !(rowLimit === 'multiple' && field.schema['x-component'] === 'AggregationRecords'),
    ));
  }, [rowLimit]);

  useClickAway({ current: popperElRef }, () => {
    setFieldSelectorShow(false);
  });

  const subTableSchemas = props.value?.properties as SchemaProperties;

  const schemaList = Object.entries(subTableSchemas || {})?.reduce((cur: Field[], next) => {
    const [key, schema] = next;
    if (key === '_id') {
      return cur;
    }
    cur.push({
      label: schema?.title as string || '',
      value: key,
      sort: numberTransform(schema),
      schema: schema,
    });
    return cur;
  }, []).sort((a, b) => a.sort - b.sort);

  function getIndex(): number {
    const indexes = schemaList.map(({ sort }) => sort);
    return Math.max(...indexes) + 1;
  }

  function getSchemaFromOptionType(type: string, currentIndex?: number): ISchema {
    if (!currentIndex) {
      return SUB_TABLE_TYPES_SCHEMA_MAP[type];
    }
    return {
      ...SUB_TABLE_TYPES_SCHEMA_MAP[type],
      'x-index': currentIndex,
    };
  }

  const currentOptions = SUB_TABLE_TYPES;

  function onUpdateFields(fields: Field[]): void {
    const newValue = {
      type: 'object',
      properties: {
        _id: getSchemaFromOptionType('id'),
        ...fields?.reduce((cur: ISchema, next: Field) => {
          const { schema, sort, value } = next;
          cur[(value || `subtable_${generateRandomFormFieldID()}`) as keyof ISchema] = {
            ...schema,
            'x-index': sort,
          };
          return cur;
        }, {}),
      },
      'x-component-props': {
        associatedFields,
        subOptionsSchema,
        subSchemaOptions,
        subOptionsChecked,
        subAssociatedFields,
        subTableID,
        associatedFieldID,
      },
    };
    props.mutators.change(newValue);
  }

  function onAddFields(label: string, val: string): void {
    const opt = currentOptions.find(({ value }) => value === val);
    if (!opt) {
      return;
    }
    const currentIndex = getIndex();
    const newField = {
      ...opt,
      sort: currentIndex,
      schema: getSchemaFromOptionType(opt.value, currentIndex),
    };
    newField.value = '';
    setCurrentFieldLabel(label);
    setCurrentFieldValue(val);
    setFieldSelectorShow(false);
    onUpdateFields([...schemaList, newField]);
  }

  function onRemove(index: number): void {
    onUpdateFields(schemaList.filter((_, idx) => idx !== index));
  }

  function onShowSubTableConfig(subTableKey: string): void {
    actions.validate().then(() => {
      actions.setFieldState('Fields.curConfigSubTableKey', (state) => {
        state.value = subTableKey;
      });
    }).catch(({ errors }) => toast.error(errors[0].messages[0]));
  }

  function handleOnDragEnd(result: DropResult): void {
    if (!result.destination) {
      return;
    }
    const { cloneDeep, get, pipe, curry, placeholder } = fp;
    const items = cloneDeep(schemaList);
    const getPosition = (path: string): number => get(`${path}.index`, result);
    const startPosition = getPosition('source');
    const endPosition = getPosition('destination');

    const removeItem = (items: Field[], startPosition: number): (Field | Field[])[] => {
      const [removed] = items.splice(startPosition, 1);
      return [items, removed];
    };

    const insertItem = curry(([items, removed]: [Field[], Field], endPosition: number) => {
      items.splice(endPosition, 0, removed);
      return items;
    });

    const reSort = (items: Field[]): Field[] => {
      items.forEach((item, index) => item.sort = index);
      return items;
    };

    const updater = pipe(removeItem, insertItem(placeholder, endPosition), reSort);
    onUpdateFields(updater(items, startPosition));
  }

  useFormEffects(() => {
    onFieldValueChange$('rowLimit').subscribe((state) => {
      setRowLimit(state.value);
    });
  });

  // 获取关联表
  const getAssociatedTable = ()=>{
    const fields = schemaToFields(schema) || [];
    // const _associatedFields = fields?.filter((item)=>(item.componentName === 'associateddata' || item.componentName === 'aggregationrecords'));
    const _associatedFields = fields?.filter((item)=>(item.componentName === 'associateddata'));
    if (_associatedFields?.length === 0) {
      return setAssociatedFields([]);
    }
    // 获取关联表下子表
    const arr: any = [];
    _associatedFields?.forEach((item: any)=>{
      const { appID, associationTableID } = item?.['x-component-props'] || {};
      getTableSchema(appID, associationTableID).then((res: any)=>{
        const { schema } = res;
        const subTableFields = schema ?
          schemaToFields(schema)?.filter((item: any)=>item?.componentName === 'subtable') :
          [];
        if (subTableFields.length) {
          item = {
            ...item,
            subTableFields,
          };
          arr.push(item);
          setAssociatedFields([...arr]);
        }
      });
    });
  };

  const getAssociatedFieldsOptions = ()=>{
    const arr = associatedFields.map((item: any)=>{
      const { subTableFields = [] } = item || {};
      return {
        value: item?.['x-component-props']?.associationTableID,
        label: item?.title,
        children: subTableFields.map((item: any)=>{
          const { subordination } = item?.['x-component-props'] || {};
          return (
            subordination === 'sub_table' &&
              {
                value: item?.['x-component-props']?.tableID,
                label: item?.title,
              }
          );
        })?.filter((item: any)=>!!item),
      };
    });

    const res = arr?.filter(({ children }: any)=>!!children.length);
    return res;
  };

  const handleAssociatedFieldsOptionsChange = (value: string[]) => {
    setSubAssociatedFields(value);
    const subOptions: any = [];
    associatedFields?.forEach((item: any)=>{
      item?.subTableFields?.forEach((child: any)=>{
        if (item?.['x-component-props']?.associationTableID === value?.[0] &&
        child?.['x-component-props']?.tableID === value?.[1]) {
          const subOptionsObj = child?.items?.properties;
          setSubOptionsSchema(subOptionsObj);
          setSubTableID(child?.id);
          setAssociatedFieldID(item?.id);
          for (const key in subOptionsObj) {
            if (key !== '_id') {
              subOptions.push({
                label: subOptionsObj[key]?.title,
                value: key,
              });
            }
          }
        }
      });
    });
    setSubSchemaOptions(subOptions);
  };

  useEffect(()=>{
    if (!subAssociatedFields?.length) {
      // setAssociatedFields([]);
      setSubOptionsSchema({});
      setSubSchemaOptions([]);
      setSubOptionsChecked({});
      setSubTableID(undefined);
      setAssociatedFieldID(undefined);
    }
  }, [subAssociatedFields]);

  const onToggleColumn = (key: string, checked: boolean)=> {
    setSubOptionsChecked({
      ...subOptionsChecked,
      [key]: checked,
    });
  };

  useEffect(()=>{
    onUpdateFields(schemaList);
  }, [subAssociatedFields, subSchemaOptions, subOptionsChecked, associatedFieldID]);

  useEffect(()=>{
    !initAssociatedFieldsFlag && setInitAssociatedFieldsFlag(true);
    if (initAssociatedFieldsFlag && subAssociatedFields?.length) {
      const options = getAssociatedFieldsOptions();
      const item = options?.find((itm: any)=>itm?.value === subAssociatedFields?.[0]);
      const child = item?.children?.find((chil: any)=>chil?.value === subAssociatedFields?.[1]);
      if (!child) {
        handleAssociatedFieldsOptionsChange([]);
      }
    }
  }, [associatedFields]);

  return (
    <>
      <div>
        <header className="flex justify-between items-center bg-gray-50 mb-16">
          <div className="mr-10">子表字段</div>
          <div
            className="flex-1 flex justify-between items-center px-16 border rounded cursor-pointer"
            ref={setReferenceElRef as Ref<HTMLDivElement>}
            onClick={() => setFieldSelectorShow((show) => !show)}
          >
            <span>{currentFieldLabel}</span>
            <Icon name="expand_more"/>
          </div>
          {fieldSelectorShow && (
            <ul
              {...popperRef.attributes.popper}
              style={{
                ...popperRef.styles.popper,
                boxShadow: '0 0 30px rgba(200, 200, 200, .7)',
                backgroundColor: '#fff',
                zIndex: 1,
                width: referenceElRef ? getComputedStyle(referenceElRef).width : 'auto',
              }}
              className="max-h-200 overflow-auto"
              ref={setPopperElRef as Ref<HTMLUListElement>}
            >
              {currentOptions.filter(
                ({ value }) => {
                  if ((rowLimit === 'multiple' && value === 'aggregationrecords')) {
                    return false;
                  }
                  return !INTERNAL_FIELD_NAMES.includes(value);
                },
              ).map(
                ({ label, value }) => {
                  return (
                    <li
                      className="px-16 cursor-pointer hover:bg-gray-1000"
                      key={value}
                      onClick={() => onAddFields(label, value)}
                    >
                      {label}
                    </li>
                  );
                })
              }
            </ul>
          )}
        </header>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="sub-table-sub-fields">
            {(dropProvided) => (
              <section
                {...dropProvided.droppableProps}
                className="border-l border-t border-r"
                ref={dropProvided.innerRef}
              >
                {schemaList.map((field, index) => (
                  <Draggable draggableId={field.value} key={field.value} index={index}>
                    {(dragProvided) => (
                      <div
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        className="grid grid-cols-3 content-center items-center grid-flow-col"
                        ref={dragProvided.innerRef}
                        style={getItemStyle(dragProvided.draggableProps.style)}
                      >
                        <div className="border-b border-r flex justify-center items-center h-full">
                          <Icon name="drag_indicator" size={20} className="cursor-move justify-self-start" />
                        </div>
                        <div
                          key={field.value}
                          className="truncate border-b border-r px-6 cursor-pointer"
                          title={field.label}
                          onClick={() => {
                            store.activeSubtableFieldId = field.value;
                            onShowSubTableConfig(field.value);
                          }}
                        >
                          {field.label}
                        </div>
                        <div className="border-b border-r flex items-center justify-end h-full pr-6">
                          <Icon
                            name="delete"
                            size={20}
                            className="cursor-pointer justify-self-end"
                            onClick={() => onRemove(index)}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </section>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {
        !!schemaList?.length &&
        (<div className=''>
          <div className='px-8 border  corner-2-8-8-8 mt-24  bg-gray-100 mb-16 py-8'>
            <div className="flex items-center">
              <Icon name="article" size={20} className="mr-8" />
              <span className="text-body2">选择关联数据表子表:</span>
            </div>
            <div>
              <Cascader
                defaultValue={subAssociatedFields}
                value={subAssociatedFields}
                options={getAssociatedFieldsOptions()}
                onChange={handleAssociatedFieldsOptionsChange} />
              <div className='text-caption pl-4'>仅支持关联数据表下从空白创建的子表</div>
            </div>
          </div>

          {!!subSchemaOptions.length && (
            <>
              <header className="flex justify-between items-center bg-gray-50 mb-16">
                <div className="mr-10">关联数据表子表字段</div>
              </header>
              <ul className="flex w-full flex-col py-12 px-28 border rounded">
                {subSchemaOptions.map(({ label, value }: any) => {
                  return (
                    <li key={value} className="flex justify-between items-center my-5">
                      <span className="mr-7">{label}</span>
                      <Toggle
                        defaultChecked={subOptionsChecked?.[value] || false}
                        onChange={(isOpen) => onToggleColumn(value, isOpen)}
                      />
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>)
      }
    </>
  );
}

SubTableSchema.isFieldComponent = true;

export default SubTableSchema;
