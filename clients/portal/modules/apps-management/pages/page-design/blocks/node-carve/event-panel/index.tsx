import React from 'react';

import { ArteryRenderer } from '@one-for-all/artery-renderer';
import repository from '../repository';
import buildConfigArtery from '../utils/buildConfigNodes';
import lifeCyclesSpec from './default-spec';
import { HOOKS_PREFIX } from '../repository/function-bind';
import Section from '../../../utils/section';

function EventPanel(): JSX.Element {
  return (
    <>
      <Section title='生命周期' defaultExpand>
        <ArteryRenderer
          artery={buildConfigArtery(lifeCyclesSpec, { prefix: HOOKS_PREFIX })}
          plugins={{ repository }}
        />
      </Section>
    </>

  );
}

export default EventPanel;
