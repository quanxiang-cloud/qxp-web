import React, { useContext, Fragment } from 'react';
import { observer } from 'mobx-react';

import ParamRow from './param-row';
import paramsContext from './context';

export type ParamType='string' | 'number' | 'boolean' | 'array' | 'object'
export type ParamGroup='path' | 'query' | 'header' | 'body' | 'constant' | 'response'

interface ConfigProps {
  group: ParamGroup;
  title?: string;
  className?: string;
  children?: React.ReactNode;
  defaultValues?: ApiParam[];
}

export interface ApiParam {
  id: string;
  name: string;
  type: ParamType,
  required: boolean;
  description: string;
  constIn: 'query' | 'body' | string; // only used in constant group
  constData: any;
  readonlyKeys?: string[];
  _object_nodes_?: Array<ApiParam>; // type=object sub nodes
  _array_nodes_?: Array<ApiParam>; // type=array sub nodes
  parentPath?: string;
  [key: string]: any;
}

function ParamsConfig({ title, group }: ConfigProps): JSX.Element {
  const store = useContext(paramsContext);

  function renderRow(row: ApiParam, idx: number, parentPath?: string): JSX.Element {
    const { _object_nodes_, _array_nodes_ } = row;
    const prefix = [parentPath || group, idx].join('.');

    return (
      <Fragment key={row.id}>
        <ParamRow
          {...row}
          idx={idx}
          group={group}
          parentPath={parentPath}
        />
        {_object_nodes_ && renderSubRows(_object_nodes_, [prefix, '_object_nodes_'].join('.'))}
        {_array_nodes_ && renderSubRows(_array_nodes_, [prefix, '_array_nodes_'].join('.'))}
      </Fragment>
    );
  }

  function renderSubRows(rows: Array<ApiParam> | undefined, prefix = ''): JSX.Element | null {
    if (Array.isArray(rows)) {
      return (
        <>
          {rows.map((row, idx)=> renderRow(row, idx, prefix))}
        </>
      );
    }
    return null;
  }

  return (
    <div className='mb-8'>
      {title && <p className='text-body mb-4'>{title}</p>}
      <div>
        <table
          className='table-auto table border-separate border border-gray-200 w-full rounded-8 params-table'
        >
          <colgroup>
            <col style={{ width: '40%', overflowX: 'auto' }} />
            <col width={150} />
            {group === 'constant' && <col width={120} />}
            <col width={80} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>参数名</th>
              <th>参数类型</th>
              {group === 'constant' && (
                <>
                  <th>数值</th>
                  <th>in</th>
                </>
              )}
              {group !== 'constant' && <th>是否必填</th>}
              <th>描述</th>
            </tr>
          </thead>
          <tbody>
            {store.parameters[group].map((row, idx)=> renderRow(row, idx))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default observer(ParamsConfig);
