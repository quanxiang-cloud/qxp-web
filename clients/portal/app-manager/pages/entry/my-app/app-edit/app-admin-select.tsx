import React, { useState } from 'react';

import Button from '@c/button';
import Icon from '@c/icon';

function AppAdminSelect() {
  const [selected, setSelected] = useState([
    { name: '张三', id: 1 },
    { name: '李四', id: 2 },
    { name: '王老五', id: 3 },
  ]);

  const removePerson = (id) => {

  };

  const personTabRender = (person:any) => {
    return (
      <div>
        <span className='mr-4'>{person.name}</span>
        <Icon onClick={} clickable changeable name='close' />
      </div>
    );
  };

  return (
    <div>
      <div>
        <Button icon='add'>
          选择
        </Button>
      </div>
      <div className='flex gap-x-8'>
        {selected.map((person)=>(
          personTabRender(person)
        ))}
      </div>
    </div>
  );
}

export default AppAdminSelect;
