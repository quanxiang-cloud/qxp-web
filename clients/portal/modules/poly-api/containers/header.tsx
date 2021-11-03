import React, { useEffect } from 'react';
import cs from 'classnames';
import { useHistory } from 'react-router-dom';
import { from, of } from 'rxjs';
import { map, concatAll } from 'rxjs/operators';

import Icon from '@c/icon';
import Button from '@c/button';

import useOrchestrationAPIPath from '../effects/hooks/use-orchestration-api-path';
import httpClient from '@lib/http-client';

interface Props {
  className?: string;
}

function PolyDetailsHeader({ className }: Props): JSX.Element {
  const history = useHistory();
  const orchestrationAPIPath = useOrchestrationAPIPath();

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

  function handleBack(): void {
    history.replace(orchestrationAPIPath);
  }

  return (
    <header
      className={cs('flex justify-between items-center px-20', className)}
    >
      <section className="text-body2-no-color text-gray-600">
        <span onClick={handleBack}>
          <Icon name="arrow-go-back" size={20} clickable />
          <span className="ml-4 cursor-pointer">返回</span>
        </span>
        <span className="mx-8">/</span>
        <span className="text-gray-900 font-semibold">API名称</span>
        <span className="text-gray-400 ml-4">(未启用)</span>
      </section>
      <section className="flex items-center">
        <div>
          <Button type="button" className="h-28 mr-10">调试</Button>
          <Button modifier="primary" type="button" className="h-28 mr-10">上线</Button>
        </div>
        <div className="w-1 bg-gray-200 mr-10" style={{ height: 30 }}></div>
        <Icon name="question_answer" />
      </section>
    </header>
  );
}

export default PolyDetailsHeader;
