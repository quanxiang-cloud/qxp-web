import React from 'react';

import comps from '../components';
import store from '../store';

function PreviewConfigurableComponent(): JSX.Element {
  return (
    <div className='gird'>
      {
        comps.map(({ Component, schemas, key }) => {
          return schemas.map((status) => {
            return (
              <div
                onClick={() => store.setCurrentComp(`${key}.${status.key}`, status.configSchema)}
                className='style-guide-comp-item p-5 cursor-pointer'
                key={status.key}
              >
                <Component {...{ [status?.property || '']: status.value }} />
              </div>
            );
          });
        })
      }
    </div>
  );
}

export default PreviewConfigurableComponent;
