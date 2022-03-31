import React, { useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import comps from '@one-for-all/headless-ui-interfaces';

import PreviewConfigurableComponent from './preview';
import CSSEditor from './css-editor';
import store from '../store';
import { applyStyle } from '../utils';

import './index.css';

function ComponentStyleConfigCenter(): JSX.Element {
  useEffect(() => {
    comps.forEach((comp) => {
      const componentCss = store.cssStore?.getComponentCss(comp.key, comp.specs);
      if (componentCss && store.shadowRoot) {
        applyStyle(comp.key, componentCss || '', store.shadowRoot);
      }
    });
  }, [store.shadowRoot]);

  return (
    <div
      style={{ gridTemplateColumns: '200px auto 500px' }}
      className='grid gap-10 h-full'>
      <div className='style-guide-comp-list'>
        {
          comps.map((comp) => {
            return (
              <div
                className={cs('py-5 pl-10 cursor-pointer hover:text-blue-400',
                  { 'bg-blue-100 text-blue-400': store.currentComp?.key === comp.key },
                )}
                key={comp.key}
                onClick={() => store.currentComp = comp}
              >
                {comp.title}
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
