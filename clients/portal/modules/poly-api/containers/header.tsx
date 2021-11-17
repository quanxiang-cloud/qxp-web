import React, { useEffect, useCallback, useState } from 'react';
import cs from 'classnames';
import { useHistory } from 'react-router-dom';
import { from, of } from 'rxjs';
import { map, concatAll } from 'rxjs/operators';

import Icon from '@c/icon';
import Button from '@c/button';
import httpClient from '@lib/http-client';
import useObservable from '@lib/hooks/use-observable';

import store$ from '../store';
import { POLY_STATUS_MAP } from '../constants';
import InputEditor from '../components/input-editor';
import { buildPoly, publishPoly } from '../utils/bulid';
import useOrchestrationAPIPath from '../effects/hooks/use-orchestration-api-path';
import { savePolyApiResult } from '../utils/save';

interface Props {
  className?: string;
}

function PolyDetailsHeader({ className }: Props): JSX.Element {
  const store = useObservable(store$);
  const history = useHistory();
  const orchestrationAPIPath = useOrchestrationAPIPath();
  const [debugLoading, setDebugLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    const types = ['node', 'value', 'oper', 'cond', 'cmp', 'in'];
    const response$ = of(...types).pipe(
      map((type) => from(httpClient(`/api/v1/polyapi/poly/enums/${type}`, { sample: true }))),
      concatAll(),
    );
    response$.subscribe((values) => {
      console.log(values);
    });
  }, []);

  const handleBack = useCallback((): void => {
    history.replace(orchestrationAPIPath);
  }, [history, orchestrationAPIPath]);

  const handleNameChange = useCallback((value: string) => {
    store$.set('name', value);
    savePolyApiResult();
  }, [store$]);

  const polyStatus = store.polyInfo ? POLY_STATUS_MAP[store.polyInfo.active] : '未启用';

  function handleDebug(): void {
    setDebugLoading(true);
    buildPoly().then(() => setDebugLoading(false));
  }

  function handlePublish(): void {
    setPublishLoading(true);
    publishPoly().then(() => setPublishLoading(false));
  }

  return (
    <header
      className={cs('flex justify-between items-center px-20', className)}
    >
      <section className="text-body2-no-color text-gray-600 flex items-center">
        <span onClick={handleBack}>
          <Icon name="arrow-go-back" size={20} clickable />
          <span className="ml-4 cursor-pointer">返回</span>
        </span>
        <span className="mx-8">/</span>
        <InputEditor
          autoMode
          className="poly-name-editor"
          value={store.name || ''}
          onChange={handleNameChange}
        />
        <span className="text-gray-400 ml-4">({polyStatus})</span>
      </section>
      <section className="flex items-center">
        <div>
          <Button
            type="button"
            className="h-28 mr-10"
            loading={debugLoading}
            onClick={handleDebug}
          >
            调试
          </Button>
          <Button
            type="button"
            modifier="primary"
            className="h-28 mr-10"
            loading={publishLoading}
            onClick={handlePublish}
          >
            上线
          </Button>
        </div>
        <div className="w-1 bg-gray-200 mr-10" style={{ height: 30 }}></div>
        <Icon name="question_answer" />
      </section>
    </header>
  );
}

export default PolyDetailsHeader;
