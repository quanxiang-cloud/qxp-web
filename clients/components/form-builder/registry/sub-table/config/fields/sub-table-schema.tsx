import React, { useContext, useState, Ref } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { usePopper } from 'react-popper';
import { nanoid } from 'nanoid';
import { useClickAway } from 'react-use';

import Icon from '@c/icon';
import { INTERNAL_FIELD_NAMES } from '@c/form-builder/store';

import { ActionsContext } from '../context';
import { SUB_TABLE_TYPES_SCHEMA_MAP, SUB_TABLE_TYPES } from '../constants';

interface Option {
  label: string;
  value: string;
  schema: ISchema;
}

interface Field extends Option {
  sort: number;
}

function SubTableSchema(props: ISchemaFieldComponentProps): JSX.Element {
  const { actions } = useContext(ActionsContext);
  const [currentFieldLabel, setCurrentFieldLabel] = useState('添加');
  const [referenceElRef, setReferenceElRef] = useState<HTMLDivElement>();
  const [popperElRef, setPopperElRef] = useState(null);
  const [fieldSelectorShow, setFieldSelectorShow] = useState(false);
  const popperRef = usePopper(referenceElRef, popperElRef, {
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }],
    placement: 'bottom-start',
  });

  useClickAway({ current: popperElRef }, () => {
    setFieldSelectorShow(false);
  });

  const subTableSchemas = props.value?.properties as SchemaProperties;

  const schemaList = Object.entries(subTableSchemas || {}).reduce((cur: Field[], next) => {
    const [key, schema] = next;
    if (key === '_id') {
      return cur;
    }
    cur.push({
      label: schema?.title as string || '',
      value: key,
      sort: schema['x-index'] || 0,
      schema: schema,
    });
    return cur;
  }, []).sort((a, b) => a.sort - b.sort);

  function getIndex(): number {
    const indexes = schemaList.map(({ sort }) => sort);
    const index = Math.max(...indexes);
    return Math.abs(index) === Infinity ? 0 : index + 1;
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
        ...fields.reduce((cur: ISchema, next: Field) => {
          const { schema, sort } = next;
          cur[nanoid() as keyof ISchema] = {
            ...schema,
            'x-index': sort,
          };
          return cur;
        }, {}),
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
    setCurrentFieldLabel(label);
    setFieldSelectorShow(false);
    onUpdateFields([...schemaList, newField]);
  }

  function onRemove(index: number): void {
    onUpdateFields(schemaList.filter((_, idx) => idx !== index));
  }

  function onShowSubTableConfig(subTableKey: string): void {
    actions.setFieldState('Fields.curConfigSubTableKey', (state) => {
      state.value = subTableKey;
    });
  }

  function handleOnDragEnd(result: DropResult): void {
    const items = [...schemaList];
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
            {currentOptions.filter(({ value }) => !INTERNAL_FIELD_NAMES.includes(value)).map(
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
          {(provided) => (
            <section
              {...provided.droppableProps}
              className="border-l border-t border-r"
              ref={provided.innerRef}
            >
              {schemaList.map((field, index) => (
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

SubTableSchema.isFieldComponent = true;

export default SubTableSchema;
