import React from 'react';

import { ArteryRenderer } from '@one-for-all/artery-renderer';
import repository from '../repository';
import buildConfigArtery from '../utils/buildConfigNodes';
import lifeCyclesSpec from './default-spec';
import { HOOKS_PREFIX } from '../repository/function-bind';

function EventPanel(): JSX.Element {
  return (
    <>
      <ArteryRenderer
        artery={buildConfigArtery(lifeCyclesSpec, HOOKS_PREFIX)}
        plugins={{ repository }}
      />
    </>

  );
}

export default EventPanel;
