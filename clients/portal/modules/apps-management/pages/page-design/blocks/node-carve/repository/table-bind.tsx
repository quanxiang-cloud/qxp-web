import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react';
import { ConfigContextState, useConfigContext } from '../context';
import { updateNodeProperty } from '../utils';
import { ConnectedProps } from '../utils/connect';
import Icon from '@one-for-all/icon';
import { get } from 'lodash';

export type ColData = {
  id: string;
  key: string;
  label: string;
  fixed?: boolean;
  width?: number;
};

export const DEFAULT_CONFIG = {
  cols: [
    {
      id: `col-${nanoid(8)}`,
      key: '',
      label: '第1列',
      fixed: false,
      width: 100,
    },
  ],
};

function TableBind({ path }: ConnectedProps<any>): JSX.Element {
  const {
    artery,
    activeNode,
    onArteryChange,
  } = useConfigContext() as ConfigContextState;

  const [cols, setCols] = useState<ColData[]>([]);
  useEffect(() => {
    setCols(get(activeNode, `${path}.value`, []));
  }, [activeNode]);

  useEffect(() => {
    if (!activeNode) {
      return;
    }
    onArteryChange(updateNodeProperty(activeNode, path, {
      type: 'constant_property',
      value: cols,
    }, artery));
  }, [cols]);

  function addCol(): void {
    setCols([
      ...cols,
      {
        id: `col-${nanoid(8)}`,
        key: '',
        label: `第${cols.length + 1}列`,
        fixed: false,
        width: 100,
      },
    ]);
  }

  function deleteCol(index: number): void {
    if (cols.length <= 1) {
      return;
    }
    cols.splice(index, 1);
    setCols([...cols]);
  }

  function handleColChange(key: string, index: number, value: string | boolean): void {
    const newCols = JSON.parse(JSON.stringify(cols));
    newCols[index][key] = value;
    setCols([...newCols]);
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-4 gap-4">
        <label>key</label>
        <label>名称</label>
        <label>宽度</label>
        <label>固定</label>
      </div>
      {cols.map((col: ColData, index: number) => (
        <div className="mb-8 flex items-center justify-between" key={col.id}>
          <div className="w-full grid grid-cols-4 gap-4">
            <input
              type="text"
              className="px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
              value={col.key}
              onChange={(e) => handleColChange('key', index, e.target.value)}
            />
            <input
              type="text"
              className="px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
              value={col.label}
              onChange={(e) => handleColChange('label', index, e.target.value)}
            />
            <input
              type="text"
              className="px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600"
              value={col.width}
              onChange={(e) => handleColChange('width', index, e.target.value)}
            />
            <div className="inline-flex items-center justify-around">
              <input
                type="checkbox"
                className="mr-8"
                checked={col.fixed}
                onChange={(e) => handleColChange('fixed', index, !col.fixed)}
              />
              <span onClick={() => cols.length > 1 && deleteCol(index)}>
                <Icon
                  name="delete"

                ></Icon>
              </span>

            </div>
          </div>
        </div>
      ))}
      <span onClick={addCol}>
        <Icon name="add" ></Icon>
      </span>

    </div>
  );
}

export default TableBind;
