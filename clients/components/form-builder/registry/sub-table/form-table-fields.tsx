import React, { useState, useRef, useContext } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useFormEffects, FormEffectHooks } from '@formily/antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import Popper from '@c/popper';
import Select from '@c/select';
import Icon from '@c/icon';
import Toggle from '@c/toggle';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';

import { generateRandomFormFieldID } from '../../utils';
import { ActionsContext } from './config-form';
import * as inputConverter from './components/input/convertor';
import * as textareaConverter from './components/textarea/convertor';
import * as numberConverter from './components/number/convertor';
import * as datetimeConverter from './components/datetime/convertor';
import * as selectorConvertor from './components/select/convertor';
import * as multipleSelectorConvertor from './components/multiple-select/convertor';

const { onFieldValueChange$ } = FormEffectHooks;

interface Option {
  label: string;
  value: string;
  schema: ISchema;
}

interface Field extends Option {
  sort: number;
}

const supportedFields = [
  'input', 'textarea', 'numberpicker', 'datepicker', 'select',
];

function FormTableFields(props: ISchemaFieldComponentProps) {
  const [title, setTitle] = useState('显示字段');
  const [schemaOptions, setSchemaOptions] = useState<Option[]>([]);
  const popReferences = useRef<HTMLDivElement>(null);
  const popRef = useRef<Popper>(null);
  const { actions } = useContext(ActionsContext);

  const subTableSchemas = props.value?.properties as SchemaProperties;
  const entries = Object.entries(subTableSchemas || {});
  const selectedFields = entries.reduce((cur: Field[], next) => {
    const [key, schema] = next;
    if (key === '_id') {
      return cur;
    }
    cur.push({
      label: schema?.title as string || '',
      value: key,
      sort: +(schema['x-index'] || entries.length),
      schema: schema,
    });
    return cur;
  }, []).sort((a, b) => a.sort - b.sort);

  const isFromEmpty = title === '子表字段';

  function getIndex() {
    const indexes = selectedFields.map(({ sort }) => sort);
    const index = Math.max(...indexes);
    return Math.abs(index) === Infinity ? 0 : index + 1;
  }

  function getSchemaFromLabel(label: string, currentIndex?: number): ISchema {
    const schemaMap: Record<string, ISchema> = {
      id: {
        display: false,
        readOnly: false,
        title: 'id',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {},
        'x-index': -1,
        'x-internal': { isSystem: true, permission: 3 },
        'x-mega-props': { labelCol: 4 },
      },
      单行文本: {
        ...inputConverter.toSchema(inputConverter.defaultConfig),
        'x-index': currentIndex,
      },
      多行文本: {
        ...textareaConverter.toSchema(textareaConverter.defaultConfig),
        'x-index': currentIndex,
      },
      数字: {
        ...numberConverter.toSchema(numberConverter.defaultConfig),
        'x-index': currentIndex,
      },
      日期时间: {
        ...datetimeConverter.toSchema(datetimeConverter.defaultConfig),
        'x-index': currentIndex,
      },
      下拉单选框: {
        ...selectorConvertor.toSchema(selectorConvertor.defaultConfig),
        'x-index': currentIndex,
      },
      下拉复选框: {
        ...multipleSelectorConvertor.toSchema(multipleSelectorConvertor.defaultConfig),
        'x-index': currentIndex,
      },
    };
    return schemaMap[label];
  }
  const labels = [
    '单行文本', '多行文本', '数字', '日期时间', '下拉单选框', '下拉复选框',
  ];
  const currentOptions = labels.map((label) => ({ label, value: generateRandomFormFieldID() }));

  function updateTitle(value: string) {
    setTitle(value === 'sub_table' ? '子表字段' : '显示字段');
  }

  useFormEffects(() => {
    onFieldValueChange$('Fields.subordination').subscribe((state) => {
      updateTitle(state.value);
    });
    onFieldValueChange$('Fields.workTableSchemaOptions').subscribe((state) => {
      setSchemaOptions(state.value);
    });
  });

  function onUpdateFields(fields: Field[]) {
    const newValue = {
      type: 'object',
      properties: {
        _id: getSchemaFromLabel('id'),
        ...fields.reduce((cur: ISchema, next: Field) => {
          const { value, schema, sort } = next;
          cur[value as keyof ISchema] = {
            ...schema,
            'x-index': sort,
          };
          return cur;
        }, {}),
      },
    };
    props.mutators.change(newValue);
  }

  function onAddFields(val: string) {
    const opt = currentOptions.find(({ value }) => value === val);
    if (!opt) {
      return;
    }
    const currentIndex = getIndex();
    const newField = {
      ...opt,
      sort: currentIndex,
      schema: getSchemaFromLabel(opt.label, currentIndex),
    };
    onUpdateFields([...selectedFields, newField]);
  }

  function onToggleFields({ label, value, schema }: {
    label: string;
    value: string;
    schema: ISchema;
  }, isOpen: boolean) {
    if (isOpen) {
      return onUpdateFields(([...selectedFields, { label, schema, value, sort: getIndex() }]));
    }
    onUpdateFields(selectedFields.filter(({ value: val }) => value !== val));
  }

  function onRemove(index: number) {
    onUpdateFields(selectedFields.filter((_, id) => id !== index));
  }

  function onShowSubTableConfig(subTableKey: string) {
    actions.getFieldState('Fields.subordination', (st) => {
      if (st.value !== 'foreign_table') {
        actions.setFieldState('Fields.curConfigSubTableKey', (state) => {
          state.value = subTableKey;
        });
      }
    });
  }

  function handleOnDragEnd(result: DropResult) {
    const items = [...selectedFields];
    if (!result.destination) {
      return;
    }
    const sourceEl = items[result.source.index];
    const targetEl = items[result.destination.index];
    [sourceEl.sort, targetEl.sort] = [targetEl.sort, sourceEl.sort];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onUpdateFields(items);
  }

  return (
    <div>
      <header className="flex justify-between items-center bg-gray-50 mb-16">
        <div className="mr-10">{title}</div>
        {isFromEmpty && (
          <Select
            className="flex-1"
            placeholder="添加"
            options={currentOptions.filter(({ value }) => !INTERNAL_FIELD_NAMES.includes(value))}
            onChange={onAddFields}
          />
        )}
        {!isFromEmpty && !!schemaOptions.length && (
          <>
            <div ref={popReferences} className="border border-gray-200 px-10 cursor-pointer">
                选择
            </div>
            <Popper
              ref={popRef}
              reference={popReferences}
              placement="bottom-start"
              modifiers={[{ name: 'offset', options: { offset: [0, 0] } }]}
            >
              <ul className="flex flex-col py-12 px-28 border rounded h-280 overflow-y-scroll">
                {schemaOptions
                  .filter(({ value, schema }) => {
                    return value !== '_id' && supportedFields.includes(
                      schema?.['x-component']?.toLowerCase() || ''
                    );
                  })
                  .map(({ label, value, schema }) => {
                    const isChecked = !!selectedFields.find(({ value: v }) => value === v);
                    return (
                      <li key={value} className="flex justify-between items-center my-5">
                        <span className="mr-7">{label}</span>
                        <Toggle
                          defaultChecked={isChecked}
                          onChange={(isOpen) => onToggleFields({ label, value, schema }, isOpen)}
                        />
                      </li>
                    );
                  })}
              </ul>
            </Popper>
          </>
        )}
      </header>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="sub-table-sub-fields">
          {(provided) => (
            <section
              {...provided.droppableProps}
              className="border-l border-t border-r"
              ref={provided.innerRef}
            >
              {selectedFields.map((field, index) => (
                <Draggable draggableId={field.value} key={field.value} index={index}>
                  {(dragProvided) => (
                    <div
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      className="grid grid-cols-3 content-center items-center grid-flow-col"
                      ref={dragProvided.innerRef}
                    >
                      <div className="border-b border-r flex justify-center items-center h-full">
                        <Icon name="drag_indicator" size={20} className="cursor-move justify-self-start" />
                      </div>
                      <div
                        key={field.value}
                        className="truncate border-b border-r px-6"
                        title={field.label}
                        onClick={() => onShowSubTableConfig(field.value)}
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
                      {/* {provided.placeholder} */}
                    </div>
                  )}
                </Draggable>
              ))}
            </section>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

FormTableFields.isFieldComponent = true;

export default FormTableFields;
