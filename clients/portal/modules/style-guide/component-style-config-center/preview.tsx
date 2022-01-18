import React from 'react';
import { observer } from 'mobx-react';

import store from '../store';

function PreviewConfigurableComponent(): JSX.Element {
  if (!store.currentComp) {
    return <div />;
  }

  const { Component, key } = store.currentComp;
  return (
    <div className='gird'>
      {
        store.currentComp.schemas.map((status) => {
          return (
            <div className='px-5' key={status.key}>
              <div className='mb-5'>{status.title}</div>
              <div
                onClick={() => store.setCurrentCompStatus(`${key}.${status.key}`, status.configSchema)}
                className='style-guide-comp-item cursor-pointer p-5 flex gap-5 items-center'
              >
                <Component {...{ [status?.property || '']: status.value }} />
                {status.commonStatus && status.commonStatus.map((additionalStatus) => {
                  return (
                    <Component
                      key={JSON.stringify(additionalStatus)}
                      {...{ [status?.property || '']: status.value }}
                      {...additionalStatus} />
                  );
                })}
              </div>
            </div>
          );
        })
      }
    </div >
  );
}

export default observer(PreviewConfigurableComponent);
