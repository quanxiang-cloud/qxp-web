import React from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import PreviewConfigurableComponent from './preview';
import comps from '../components';
import CSSEditor from './css-editor';
import store from '../store';

import './index.css';

function ComponentStyleConfigCenter(): JSX.Element {
  return (
    <div
      style={{ gridTemplateColumns: '200px auto 500px' }}
      className='grid gap-10'>
      <div className='style-guide-comp-list'>
        {
          comps.map((comp) => {
            return (
              <div
                className={cs('py-5 pl-10 cursor-pointer hover:text-blue-500',
                  { 'bg-blue-200 text-blue-500': store.currentComp?.key === comp.key },
                )}
                key={comp.key}
                onClick={() => store.currentComp = comp}
              >
                {comp.name}
              </div>
            );
          })
        }
      </div>
      <PreviewConfigurableComponent />
      {store.currentCompStatus ? <CSSEditor /> : <div />}
    </div>
  );
}

export default observer(ComponentStyleConfigCenter);
