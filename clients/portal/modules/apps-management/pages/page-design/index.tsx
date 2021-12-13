import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Icon from '@c/icon';
import { getQuery } from '@lib/utils';

import { Designer } from '@ofa/page-engine';

interface Props {
  className?: string;
}

function PageDesign(props: Props) {
  const { appID, pageId } = useParams<{appID: string; pageId: string}>();
  const { pageName } = getQuery<{ pageName: string }>();
  const history = useHistory();

  return (
    <Designer
      title={(
        <div className='inline-flex items-center text-gray-900 text-12'>
          <Icon name='keyboard_backspace' className='mr-8' onClick={history.goBack} clickable />
          <span className='mr-4'>正在设计页面:</span>
          <span>{pageName}</span>
        </div>
      )}
    />
  );
}

export default PageDesign;
