import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';
import { Radio, RadioGroup } from '@one-for-all/ui';

import { useCtx } from '../../../ctx';
import ConfigBind from '../../../utils/data-bind';
import { INNER_LINK_FUNC_SPEC } from './constants';

export interface Props {
  content: string;
  linkType: 'outside' | 'inside',
  linkUrl?: string,
  isBlank?: boolean,
}

export const DEFAULT_CONFIG: Props = {
  content: '链接',
  linkType: 'outside',
  linkUrl: '',
  isBlank: false,
};

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState(defaults(page.activeElemProps, DEFAULT_CONFIG));
  // todo: remove
  // const example = [{ label: '示例页面', value: '#' }];

  useEffect(() => {
    if (values.linkType === 'inside') {
      return page.updateElemProperty(page.activeElem.id, 'props', {
        ...values,
        onClick: INNER_LINK_FUNC_SPEC,
      });
    }

    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    setValues(page.activeElemProps);
  }, [page.activeElemId]);

  return (
    <form>
      <div className='mb-8'>
        <label className='mr-4 text-12 text-gray-600'>ID</label>
        <div className='mb-8 flex items-center justify-between'>
          <input
            type="text"
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            value={values.id || ''}
            onChange={(e) => setValues({ ...values, id: e.target.value })}
          />
          <ConfigBind name='id' />
        </div>
      </div>
      <div className='mb-8'>
        <p className='text-12 text-gray-600'>内容</p>
        <div className='flex items-center'>
          <input
            type='text'
            className='w-full h-32 my-4 px-8 mr-8 border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            value={values.content}
            onChange={(ev) => setValues({ ...values, content: ev.target.value })}
          />
          <ConfigBind name='content' />
        </div>
      </div>
      {/* {
        values.linkType === 'inside' ? (
          <div className='mb-8'>
            <p className='mr-4 text-12 text-gray-600'>选择页面</p>
            <Select
              name='insidePage'
              options={[]}
              value={values.linkPage}
              onChange={(linkPage) => setValues({ ...values, linkPage })}
            />
          </div>
        ) : (<></>)
      } */}
      <div className='mb-8'>
        <p className='text-12 text-gray-600'>链接类型</p>
        <RadioGroup
          className='flex items-center'
          onChange={(linkType) => setValues({ ...values, linkType })}
        >
          <Radio
            label='外部链接'
            value='outside'
            className='mr-10'
            defaultChecked={values.linkType === 'outside'}
          />
          <Radio
            label='内部页面'
            value='inside'
            defaultChecked={values.linkType === 'inside'}
          />
        </RadioGroup>
      </div>
      <div className='mb-8'>
        <p className='mr-4 text-12 text-gray-600'>链接地址</p>
        <div className='flex items-center'>
          <input
            placeholder={values.linkType === 'outside' ? '请输入完整url路径 例：https://example.com' : '请输入路由path 例：/a/path/to/some/page'}
            className='w-full h-32 my-4 px-8 mr-8 border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            value={values.linkUrl}
            onChange={(ev) => setValues({ ...values, linkUrl: ev.target.value })}
          />
          <ConfigBind name='linkUrl' />
        </div>
      </div>
      <div className='mb-8 flex items-center justify-between'>
        <div className='w-full flex items-center'>
          <input
            disabled={values.linkType === 'inside'}
            type="checkbox"
            className='w-full h-32 my-4 px-8 mr-4'
            style={{ width: 15 }}
            checked={values.isBlank}
            onChange={(ev) => setValues({ ...values, isBlank: ev.target.checked })}
          />
          <span className='ml-8 text-12 text-gray-900 whitespace-nowrap'>新开标签页</span>
        </div>
        <ConfigBind name='isBlank' />
      </div>
    </form>
  );
}

export default ConfigForm;
