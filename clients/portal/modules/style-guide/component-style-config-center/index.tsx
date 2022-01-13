import React from 'react';
import { observer } from 'mobx-react';

import PreviewConfigurableComponent from './preview';
import CSSEditor from './css-editor';
import store from '../store';

import './index.css';

function ComponentStyleConfigCenter(): JSX.Element {
  return (
    <div className='grid grid-cols-2'>
      <PreviewConfigurableComponent />
      {store.currentConfigComp ? <CSSEditor /> : null}
    </div>
  );
}

export default observer(ComponentStyleConfigCenter);
