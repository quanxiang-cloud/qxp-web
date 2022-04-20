// import React from 'react';
// import { observer } from 'mobx-react';

// import Checkbox from '@c/checkbox';

// import store, { Fields } from '../store';

//  type FieldsProps = {
//   field: Fields,
//   index: number,
// }

// export function turnFields(field: Fields, index: number): JSX.Element {
//   const _index = index + 1;
//   const ele = Object.entries(field).map(([fieldKey, fieldsValue]) => {
//     return (
//       <div key={fieldKey} style={{
//         paddingLeft: `${index * 8}px`,
//       }}>
//         <div className='flex'>
//           <span>{fieldsValue.title || fieldKey}</span>
//           <Checkbox
//             checked={fieldsValue?.checked || false}
//             onChange={() => console.log(111)}
//           />
//         </div>
//         {turnFields(fieldsValue?.properties || {}, _index)}
//       </div>
//     );
//   });
//   return <>{ele}</>;
// }

// function OutPutRange(): JSX.Element {
//   return (
//     <>
//       {turnFields(store.outPutFields, 1)}
//     </>
//   );
// }

// export default observer(OutPutRange);

import React from 'react';
import Icon from '@c/icon';
import Tree from '@c/headless-tree';

import FieldRender from './field-node';
import { observer } from 'mobx-react';
import store from '../store';

function InPutRange(): JSX.Element {
  if (!store.inputTreeStore) {
    return <div>no outputTreeStore</div>;
  }

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <div className='rounded-12 rounded-tl-4 flex items-center bg-blue-100 text-blue-600 py-10 px-16'>
        <Icon name='info' color='blue' className='w-16 h-16 fill-current' size={18} />
        <span className='ml-10 text-12'>
        用户在访问时只能看到在这里定义允许接收的所有参数。如果传递多余的参数，系统会自动过滤。
        </span>
      </div>
      <div className='grid gap-x-16 grid-flow-row-dense px-16 py-8 pr-0 grid-cols-4 fields-item'>
        <span>可访问</span>
        <span>字段</span>
        <span>标识</span>
        <span>字段类型</span>
      </div>
      <Tree
        store={store.inputTreeStore}
        NodeRender={FieldRender}
        RootNodeRender={FieldRender}
        className='fields-tree overflow-auto flex-1'
        itemClassName=' hover:bg-white hover:text-gray-900 text-gray-900'
      />
    </div>
  );
}

export default observer(InPutRange);
