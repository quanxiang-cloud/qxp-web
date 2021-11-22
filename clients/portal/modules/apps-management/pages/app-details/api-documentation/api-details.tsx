import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/plugins/custom-class/prism-custom-class.js';
import 'prismjs/components/prism-python.js';

import Icon from '@c/icon';
import Toggle from '@c/toggle';
import Tooltip from '@c/tooltip';
import { copyContent } from '@lib/utils';
import RadioButtonGroup from '@c/radio/radio-button-group';

import '../prism.css';

import { useState } from 'react';
import { getApiDoc } from './api';
import toast from '@lib/toast';
import Loading from '@c/loading';

const DOC_TYPE_LIST = [
  { label: 'CURL', value: 'curl' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
];

type Props = {
  apiPath: string,
}

function ApiDetails({ apiPath }:Props ): JSX.Element {
  const [docType, setDocType] = useState<DocType>('curl');
  const [isAPILoading, setIsAPILoading] = useState<boolean>(true);
  const [useFieldsID, setUseFieldsID] = useState<boolean>(false);
  const [aPiContent, setAPiContent] = useState<APiContent | null>(null);

  useEffect(() => {
    setIsAPILoading(true);
    if (apiPath) {
      getApiDoc(apiPath, {
        docType,
        titleFirst: useFieldsID,
      }).then((res: QueryDocRes) => {
        const { doc } = res || {};
        setAPiContent(doc);
      }).catch((err: string) => {
        toast.error(err);
      }).finally(()=> {
        setIsAPILoading(false);
      });
    }
  }, [docType, useFieldsID, apiPath]);

  useEffect(() => {
    Prism.highlightAll();
    Prism.plugins.customClass.map({
      number: 'pr-number',
    });
  }, [aPiContent, isAPILoading]);

  return (
    <>
      <div className='h-56 flex items-center justify-between ml-1'>
        <RadioButtonGroup
          radioBtnClass="bg-white"
          onChange={(docType) => setDocType(docType as DocType)}
          listData={DOC_TYPE_LIST}
          currentValue={docType}
        />
        <div className='flex items-center'>
            使用字段名称:
          <Toggle
            className='ml-8'
            defaultChecked={useFieldsID}
            onChange={() => setUseFieldsID(!useFieldsID)}
          />
        </div>
      </div>
      {isAPILoading ? <Loading/> : (
        <>
          <div className='api-content-title'>请求示例</div>
          <div className='api-content'>
            <Tooltip
              position="top"
              label="复制"
            >
              <Icon
                name="content_copy"
                size={20}
                className='copy-button icon-text-btn'
                onClick={() => copyContent(aPiContent?.input as string)}
              />
            </Tooltip>
            <pre className='api-details'>
              <code className={`language-${docType === 'curl' ? 'bash' : docType}`}>
                {`${aPiContent?.input as string}`}
              </code>
            </pre>
          </div>
          <div className='api-content-title'>返回示例</div>
          <pre className='api-details'>
            <code className={`language-${docType === 'curl' ? 'bash' : docType}`}>
              {`${aPiContent?.output as string}`}
            </code>
          </pre>
        </>
      )}
    </>
  );
}

export default ApiDetails;
