import React, { useState, useRef, useEffect, useContext } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { useFormEffects, FormEffectHooks } from '@formily/antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import Popper from '@c/popper';
import Select from '@c/select';
import Icon from '@c/icon';
import Toggle from '@c/toggle';

import { generateRandomFormFieldID } from '../../utils';
import { ActionsContext } from './config-form';
import * as inputConverter from './components/input/convertor';
import * as textareaConverter from './components/textarea/convertor';
import * as radioGroupConverter from './components/radio-group/convertor';

const { onFieldValueChange$ } = FormEffectHooks;

function FormTableFields(props: ISchemaFieldComponentProps) {
  const [title, setTitle] = useState('');
  const [schemaOptions, setSchemaOptions] = useState<{
    label: string;
    value: string;
    schema: ISchema;
  }[]>([]);
  const [selectedFields, setSelectedFields] = useState<{
    label: string;
    value: string;
    sort: number;
    schema: ISchema;
  }[]>([]);
  const popReferences = useRef<HTMLDivElement>(null);
  const popRef = useRef<Popper>(null);
  const actions = useContext(ActionsContext);

  useEffect(() => {
    const subTableSchemas = props.value?.properties ?? {};
    const fields = Object.entries(subTableSchemas).reduce((cur: any, next: any) => {
      cur.push({
        label: next[1].title,
        value: next[0],
        sort: Number.isNaN(+next[1]['x-index']) ? selectedFields.length : +next[1]['x-index'],
        schema: next[1],
      });
      return cur;
    }, []).sort((a: any, b: any) => a.sort - b.sort);
    setSelectedFields(fields);
  }, [props.value?.properties]);

  const isFromEmpty = title === '子表字段';

  function getIndex() {
    const indexes = selectedFields.map(({ sort }) => sort);
    const index = Math.max(...indexes);
    return Math.abs(index) === Infinity ? 0 : index + 1;
  }

  function getSchemaFromLabel(label: string, currentIndex: number): ISchema {
    const schemaMap: Record<string, ISchema> = {
      单行文本: {
        ...inputConverter.toSchema(inputConverter.defaultConfig),
        'x-index': currentIndex,
      },
      多行文本: {
        ...textareaConverter.toSchema(textareaConverter.defaultConfig),
        'x-index': currentIndex,
      },
      单选框: {
        ...radioGroupConverter.toSchema(radioGroupConverter.defaultConfig),
        'x-index': currentIndex,
      },
      复选框: {},
      数字: {},
      日期时间: {},
      下拉单选框: {},
      下拉复选框: {},
    };
    return schemaMap[label];
  }
  const labels = [
    '单行文本', '多行文本', '单选框', '复选框', '数字', '日期时间', '下拉单选框', '下拉复选框',
  ];
  const currentOptions = labels.map((label) => ({ label, value: generateRandomFormFieldID() }));

  function updateTitle(getFieldState: Function) {
    const title = getFieldState('Fields.subordination').value === 'sub_table' ?
      '子表字段' : '显示字段';
    setTitle(title);
  }

  useFormEffects(($, { getFieldState }) => {
    updateTitle(getFieldState);
    onFieldValueChange$('Fields.subordination').subscribe(() => updateTitle(getFieldState));
    onFieldValueChange$('Fields.workTableSchemaOptions').subscribe((state) => {
      setSchemaOptions(state.value);
    });
  });

  function onUpdateFields(fields: any) {
    const newColumns: {title: string; dataIndex: string}[] = [];
    const newValue = {
      type: 'object',
      properties: fields.reduce((cur: any, next: any) => {
        const { value, schema, sort } = next;
        newColumns.push({ title: schema?.title ?? '', dataIndex: value });
        cur[value] = {
          ...schema,
          'x-index': sort,
        };
        return cur;
      }, {}),
    };
    props.mutators.change(newValue);
    actions.setFieldState('Fields.columns', (state) => {
      state.value = newColumns;
    });
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
    actions.setFieldState('Fields.curConfigSubTableKey', (state) => {
      state.value = subTableKey;
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
          <Select className="flex-1" placeholder="添加" options={currentOptions} onChange={onAddFields} />
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
                {schemaOptions.map(({ label, value, schema }) => {
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
