import React, { useMemo, useCallback, CSSProperties } from 'react';
import cs from 'classnames';
import ArteryEngine, { Props } from '@one-for-all/artery-engine';
import { useMonaco } from '@monaco-editor/react';
import { useQuery } from 'react-query';

import toast from '@lib/toast';
import { getQuery } from '@lib/utils';
import Loading from '@c/loading';

import { queryArtery, useStyle } from './hooks';
import { PAGE_DESIGN_ID, LAYERS } from './constants';
import Ctx from './ctx';
import stores from './stores';
import { savePage } from './api';
import { getInitArtery } from './utils';
import type { BlocksCommunicationType } from './types';
import FountainContext, { createFountainCTXValue } from './fountain-context';
import { loadFountainPackages } from './utils/package';

import './index.scss';
import styles from './index.m.scss';

const resetStyle: CSSProperties = { overflow: 'hidden' };

function PageDesign(): JSX.Element | null {
  const { appID, arteryID } = getQuery<{ appID: string, pageName: string, arteryID: string }>();
  useMonaco();
  useStyle('body', resetStyle);
  useStyle('html', resetStyle);

  const { data: fountainPackages, isLoading } = useQuery('fountainPackages', loadFountainPackages);
  const { artery, isLoading: isArteryLoading } = queryArtery(arteryID);

  const { layers, blocksCommunicationStateInitialValue } = useMemo(
    (): Props<BlocksCommunicationType> => {
      return {
        layers: [...LAYERS],
        artery: artery ?? getInitArtery(),
        blocksCommunicationStateInitialValue: {
          appID,
          arteryID: '',
          menu: { panelWidth: 280 },
          block: {},
        },
      };
    },
    [artery],
  );

  const handleSave = useCallback((page_artery: any): Promise<void> => {
    return savePage(arteryID, page_artery)
      .catch((err: Error) => toast.error(err.message));
  }, []);

  if (isArteryLoading || isLoading) {
    return <Loading desc="加载中..." />;
  }

  return (
    <Ctx.Provider value={Object.assign(stores, { onSave: handleSave })}>
      <div className={cs(styles.designer)}>
        <div id={PAGE_DESIGN_ID}>
          <FountainContext.Provider value={createFountainCTXValue(fountainPackages || [])}>
            <ArteryEngine
              artery={artery ?? getInitArtery()}
              layers={layers}
              blocksCommunicationStateInitialValue={blocksCommunicationStateInitialValue}
            />
          </FountainContext.Provider>
        </div>
      </div>
    </Ctx.Provider>
  );
}

export default PageDesign;
