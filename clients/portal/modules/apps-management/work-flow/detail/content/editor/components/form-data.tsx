import React, { useRef } from 'react';
import cs from 'classnames';

import { updateStore, Data } from '../store';
import NodeHeader from './_common/node-header';

interface Props {
  data: Data;
}

export default function FormDataNodeComponent({ data }: Props) {
  const isNew = !data.businessData.form.name;
  const lastTime = useRef(+new Date());

  function onMouseUp() {
    if (+new Date - lastTime.current < 100) {
      updateStore(null, () => ({ asideDrawerType: 'formDataForm' }));
    }
  }

  return (
    <div
      className={cs(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col',
        `w-${data.nodeData.width}`, `h-${data.nodeData.height}`
      )}
      onMouseDown={() => lastTime.current = +new Date()}
      onMouseUp={onMouseUp}
    >
      <NodeHeader
        title={data.nodeData.name}
        type="formData"
        className="bg-gray-100"
        iconName="form-data"
        titleClassName="text-gray-600 bg-gray-100"
      />
      <footer className="p-8 flex items-center flex-1">
        {isNew && (
          <span className="text-caption text-gray-400 px-4">选择工作表</span>
        )}
        {!isNew && (
          <div className="text-caption-no-color px-4 bg-gray-100 rounded-4 w-full">
            <span className="text-gray-400">工作表: </span>
            <span className="text-gray-600">{data.businessData.form.name}</span>
          </div>
        )}
      </footer>
    </div>
  );
}
