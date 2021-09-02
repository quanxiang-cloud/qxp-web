import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Button from '@c/button';

interface Props {
  className?: string;
}

function ApiList(props: Props) {
  const history = useHistory();
  const { url } = useRouteMatch();

  return (
    <div className='w-full'>
      <div className='mb-20'>
        <Button
          className='mr-20'
          modifier='primary'
          onClick={()=> history.push(`${url}/add`)}
        >
          新增 API
        </Button>
        <Button>批量导入</Button>
      </div>
      <div>

      </div>
    </div>
  );
}

export default ApiList;
