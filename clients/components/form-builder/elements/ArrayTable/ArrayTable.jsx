import React, { useContext, useState, useEffect } from 'react';
import {
  SchemaField,
  complieExpression,
  FormExpressionScopeContext,
} from '@formily/react-schema-renderer';
import { toArr, isFn, isArr, FormPath } from '@formily/shared';
import { ArrayList, DragListView } from '@formily/react-shared-components';
import { Table, Form } from 'antd';
import { FormItemShallowProvider } from '@formily/antd';
import styled from 'styled-components';
import { PlusOutlined, DeleteOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useFormBuilderContext } from '../../context';
// import { Icon } from '@pitrix/lego-ui';

import CircleButton from './CircleButton';
import TextButton from './TextButton';

const ArrayComponents = {
  CircleButton,
  TextButton,
  AdditionIcon: () => <PlusOutlined style={{ fontSize: 20 }} />,
  RemoveIcon: () => <DeleteOutlined />,
  MoveDownIcon: () => <DownOutlined />,
  MoveUpIcon: () => <UpOutlined />,
};

const DragHandler = styled.span`
  width: 7px;
  display: inline-block;
  height: 14px;
  border: 2px dotted #c5c5c5;
  border-top: 0;
  border-bottom: 0;
  cursor: move;
  margin-bottom: 24px;
`;

const ArrayTable = ({ name, value, schema, className, editable, path, mutators, form }) => {
  const expressionScope = useContext(FormExpressionScopeContext);
  const { registry } = useFormBuilderContext();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [realValue, setRealValue] = useState(value);
  const {
    renderAddition,
    renderRemove,
    renderMoveDown,
    renderMoveUp,
    renderEmpty,
    renderExtraOperations,
    operationsWidth,
    operations,
    draggable,
    allowRemove,
    allowSort,
    arrayListMode,
    selectType,
    optionType,
    allowAdd,
    ...componentProps
  } = schema.getExtendsComponentProps() || {};
  const schemaItems = Array.isArray(schema.items)
    ? schema.items[schema.items.length - 1]
    : schema.items;
  const onAdd = () => {
    if (schemaItems) {
      mutators.push(schemaItems.getEmptyValue());
    }
  };
  const onMove = (dragIndex, dropIndex) => {
    mutators.move(dragIndex, dropIndex);
  };
  const renderColumns = items => {
    return items.mapProperties((props, key) => {
      const itemProps = {
        ...props.getExtendsItemProps(),
        ...props.getExtendsProps(),
      };
      return {
        title: complieExpression(props.title, expressionScope),
        ...itemProps,
        key,
        dataIndex: key,
        render: (v, record, index) => {
          const newPath = FormPath.parse(path).concat(index, key);
          const isRequired = selectedRowKeys.includes(index) && props.required;
          return (
            <FormItemShallowProvider
              key={newPath.toString()}
              label={undefined}
              labelCol={undefined}
              wrapperCol={undefined}
            >
              <SchemaField path={newPath} schema={{ ...props, required: isRequired }} />
            </FormItemShallowProvider>
          );
        },
      };
    });
  };
  // 兼容异步items schema传入
  let columns = [];
  if (schema.items) {
    columns = isArr(schema.items)
      ? schema.items.reduce((buf, items) => {
          return buf.concat(renderColumns(items));
        }, [])
      : renderColumns(schema.items);
  }
  if (editable && operations !== false) {
    columns.push({
      ...operations,
      key: 'operations',
      dataIndex: 'operations',
      width: operationsWidth || 200,
      render: (v, record, index) => {
        return (
          <Form.Item>
            <div className="array-item-operator">
              {allowRemove ? (
                <ArrayList.Remove index={index} onClick={() => mutators.remove(index)} />
              ) : null}
              {allowSort ? (
                <>
                  <ArrayList.MoveDown index={index} onClick={() => mutators.moveDown(index)} />
                  <ArrayList.MoveUp index={index} onClick={() => mutators.moveUp(index)} />
                </>
              ) : null}
              {isFn(renderExtraOperations) ? renderExtraOperations(index) : renderExtraOperations}
            </div>
          </Form.Item>
        );
      },
    });
  }

  if (draggable) {
    columns.unshift({
      width: 20,
      key: 'dragHandler',
      render: () => {
        return <DragHandler className="drag-handler" />;
      },
    });
  }

  const rowSelection =
    arrayListMode === 'select'
      ? {
          type: selectType,
          selectedRowKeys,
          onChange: keys => {
            setSelectedRowKeys(keys);
            // console.log(form);
          },
        }
      : null;

  const renderTable = () => {
    return (
      <Table
        {...componentProps}
        rowKey={record => {
          return toArr(realValue).indexOf(record);
        }}
        pagination={false}
        columns={columns}
        dataSource={toArr(realValue)}
        rowSelection={rowSelection}
      />
    );
  };

  const setStaticValue = () => {
    // console.log('setStaticValue');
  };

  async function setRemoteValue() {
    const { remoteFunc, method, url } = componentProps;
    if (!remoteFunc) {
      return;
    }
    const { func } = registry.getRemoteFunc(remoteFunc);
    if (remoteFunc === 'common') {
      if (!url) return;
      const data = await func({ url, method, formType: 'arrayList', formName: name });
      // console.log('data==', data);
      setRealValue(data);
      mutators.change(data);
    }
  }

  useEffect(() => {
    if (optionType === 'remote') {
      setRemoteValue();
    } else {
      setStaticValue();
    }
  }, [optionType, arrayListMode]);

  return (
    <div className={className}>
      <ArrayList
        value={realValue}
        minItems={componentProps.minItems}
        maxItems={componentProps.maxItems}
        editable={editable}
        components={ArrayComponents}
        renders={{
          renderAddition,
          renderRemove,
          renderMoveDown,
          renderMoveUp,
          renderEmpty,
        }}
      >
        {draggable ? (
          <DragListView
            onDragEnd={onMove}
            nodeSelector="tr.ant-table-row"
            ignoreSelector="tr.ant-table-expanded-row"
          >
            {renderTable()}
          </DragListView>
        ) : (
          renderTable()
        )}
        {allowAdd ? (
          <ArrayList.Addition>
            {({ children }) => {
              return (
                children && (
                  <div className="array-table-addition" onClick={onAdd}>
                    {children}
                  </div>
                )
              );
            }}
          </ArrayList.Addition>
        ) : null}
      </ArrayList>
    </div>
  );
};

const styledArrayTable = styled(ArrayTable)`
  width: 100%;
  margin-bottom: 10px;
  table {
    margin-bottom: 0 !important;
  }
  .ant-table-cell {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
  .array-table-addition {
    background: #fbfbfb;
    cursor: pointer;
    margin-top: 3px;
    border-radius: 3px;
    .next-btn-text {
      color: #888;
    }
    .next-icon:before {
      width: 16px !important;
      font-size: 16px !important;
      margin-right: 5px;
    }
  }
  .ant-btn {
    color: #888;
  }
  .array-item-operator {
    display: flex;
    button {
      margin-right: 8px;
    }
  }
`;

styledArrayTable.isFieldComponent = true;

export default styledArrayTable;
