import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import cs from 'classnames';
import { useMutation } from 'react-query';
import { get, values, omit } from 'lodash';

import Select from '@c/select';
import Button from '@c/button';
import toast from '@lib/toast';
import Loading from '@c/loading';

import Header from '../comps/header';
import { ErrorMsg } from '../comps/form';
import ParamsSection from './params-section';
import ParamsConfig, { ParamGroup } from './params-config';
import store from '../store';
import paramsContext from './context';
import { getDefaultParam } from './store';
import { useNamespace, useQueryString } from '../hooks';
import { queryNativeApi, queryNativeApiDoc } from '../api';

import './styles.scss';

interface Props {
  className?: string;
}

type MetaInfo={
  title: string;
  description: string;
  apiName: string; // api标识
  apiPath: string; // 用户的原始api路径
}

const methodOptions = [
  { label: 'GET', value: 'get' },
  { label: 'POST', value: 'post' },
  { label: 'PUT', value: 'put' },
  { label: 'DELETE', value: 'delete' },
  { label: 'OPTION', value: 'option' },
  { label: 'PATCH', value: 'patch' },
];

const regApiName = /^[a-zA-Z_]\w+$/; // api标识，swagger的 api path部分
const regPathParam = /:([^/:]+)/g;

const paramGroups = ['path', 'query', 'header', 'body'];

function getAllPathParamNames(url: string): string[] {
  return url.match(regPathParam) || [];
}

function AddApi(props: Props) {
  const paramsStore = useContext(paramsContext);
  const formInst = useForm();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = formInst;
  const history = useHistory();
  const ns = useNamespace();
  const { appID } = useParams<{appID: string}>();
  const [submitting, setSubmitting] = useState(false);
  const watchApiPath = watch('apiPath');
  const watchApiName = watch('apiName');
  const qs = useQueryString();
  const isEdit = qs.get('action') === 'edit';
  const apiPath = qs.get('api_path');
  const [apiDetail, setApiDetail] = useState<PolyAPI.NativeApi | null>(null);

  const createApiMutation = useMutation(store.registerApi, {
    onMutate: ()=> {
      setSubmitting(true);
    },
    onSuccess: (data)=> {
      toast.success('创建成功');
      paramsStore.reset();
      setTimeout(toListPage, 500);
    },
    onError: (err)=> {
      toast.error(err);
    },
    onSettled: ()=> {
      setSubmitting(false);
    },
  });

  useEffect(()=> {
    if (isEdit && apiPath) {
      Promise.all([
        queryNativeApi(apiPath),
        queryNativeApiDoc(apiPath, { docType: 'swag' }),
      ]).then(([detail, doc])=> {
        console.log('api doc: ', doc);
        const apiPath = detail.url.slice(`${detail.schema}://${detail.host}`.length);
        const { parameters = [], responses = {}, ['x-consts']: constants = [] } = values(get(doc, `doc.paths.${apiPath}`))[0] || {};
        // todo: set initial param store's parameters
        paramGroups.forEach((gp)=> {
          const gpItems = parameters.map((v: {in: string})=> {
            if (v.in === gp) {
              return omit(v, 'in');
            }
          }).filter(Boolean);
          paramsStore.setParams(gp as ParamGroup, gpItems as any);
        });

        setApiDetail(detail);
        setInitialValues({
          title: detail.title,
          apiPath,
          apiName: detail.name,
          description: detail.desc,
        });
      });
    }
  }, [apiPath]);

  useEffect(()=> {
    if (!store.svc) {
      store.fetchSvc();
    }
  }, [store.svc]);

  // when api path include path params
  useEffect(()=> {
    if (watchApiPath) {
      const pathParams = getAllPathParamNames(watchApiPath).map((name)=> {
        return getDefaultParam({ name: name.slice(1), required: true, readonlyKeys: ['name', 'required'] });
      });

      paramsStore.setParams('path', pathParams);
    }
  }, [watchApiPath]);

  // watch api name, sync with proxy path
  useEffect(()=> {
    const prefix = getProxyPath();
    setValue('proxyPath', watchApiName ? [prefix, watchApiName].join('/') : prefix);
  }, [watchApiName, store.svc]);

  function setInitialValues(values: Record<string, any>) {
    Object.entries(values).map(([name, val])=> {
      setValue(name, val);
    });
  }

  function toListPage():void {
    history.push(`/apps/details/${appID}/api_proxy?ns=${ns}`);
  }

  function getProxyPath(): string {
    const svcPath = store.svc?.fullPath || '';
    const lastIdx = svcPath.lastIndexOf('/');
    if (lastIdx < 0) {
      return svcPath;
    }
    return svcPath.slice(0, lastIdx);
  }

  function buildSwagger(
    { parameters, constants, responses }: Record<'constants' | 'parameters' | 'responses', any>,
    { title, apiName, apiPath, description }: MetaInfo,
  ): Record<string, any> {
    return {
      swagger: '2.0',
      info: {
        version: 'v1',
      },
      basePath: '/',
      schemes: ['http'],
      'x-consts': constants,
      paths: {
        [apiPath]: {
          [paramsStore.method]: {
            summary: title,
            description,
            operationId: apiName,
            consumes: ['application/json'],
            parameters,
            responses,
          },
        },
      },
    };
  }

  function onSubmit(): void {
    handleSubmit(async (formData: any)=> {
      const swagger = buildSwagger(paramsStore.swaggerParameters, formData);
      // console.log('add api swagger: ', paramsStore.swaggerParameters, swagger);

      const params = {
        version: 'v1',
        // namespace: '',
        swagger: JSON.stringify(swagger),
      };

      createApiMutation.mutate(params);
    })();
  }

  function renderPathParams(): JSX.Element | undefined {
    if (getAllPathParamNames(watchApiPath || '').length) {
      return (
        <ParamsConfig title='Path' group='path' />
      );
    }
  }

  if (isEdit && !apiDetail) {
    return <Loading />;
  }

  return (
    <>
      <Header name={isEdit ? '修改 API' : '新建 API'} />
      <FormProvider {...formInst}>
        <form onSubmit={onSubmit} className='flex flex-col px-20 py-16 w-full overflow-auto'>
          <div className='mb-16'>
            <p>API 名称</p>
            <input
              className={cs('input', { error: errors.title })}
              placeholder='请输入'
              maxLength={32}
              {...register('title', { required: '请填写 API 名称' })}
            />
            <ErrorMsg errors={errors} name='title'/>
            <p className='text-caption'>最多 20 个字符，仅支持中英文</p>
          </div>

          <div className='mb-16'>
            <p>API 路径</p>
            <input
              className={cs('input', { error: errors.apiPath })}
              placeholder='请输入'
              maxLength={200}
              {...register('apiPath', {
                required: '请填写 API 路径',
              })}
            />
            <ErrorMsg errors={errors} name='apiPath'/>
            <p className='text-caption'>最多 200 个字符，支持英文字母、下划线、斜线、数字、冒号。例如：/api/v1/app/xx</p>
          </div>

          <div className='flex items-center mb-16'>
            <div className='w-120 mr-12'>
              <p>请求方法</p>
              <Select
                options={methodOptions}
                value={paramsStore.method}
                onChange={paramsStore.setMethod}
                disabled={isEdit}
              />
            </div>
            <div className='mr-12 flex-1'>
              <p>代理路径</p>
              <input
                className='input min-w-259 bg-gray-100'
                readOnly
                defaultValue=''
                {...register('proxyPath')}
              />
            </div>
            <div className='w-259'>
              <p>API 标识</p>
              <input
                placeholder='请输入，分组内不可重复'
                maxLength={32}
                readOnly={isEdit}
                className={cs('input', {
                  error: errors.apiName,
                  'bg-gray-100': isEdit,
                })}
                {...register('apiName', { required: true, pattern: regApiName })}
              />
            </div>
          </div>

          <div className='mb-16'>
            <p>描述</p>
            <textarea
              className='textarea' rows={3}
              placeholder='选填 (不超过 200 字符)'
              maxLength={200}
              {...register('description', { maxLength: 200 })}
            />
          </div>

          <ParamsSection title='请求参数' toggleable>
            {renderPathParams()}
            <ParamsConfig title='Query' group='query' />
            <ParamsConfig title='Header' group='header' />
            <ParamsConfig title='Body' group='body' />
            <ParamsConfig title='常量参数' group='constant' />
          </ParamsSection>

          <ParamsSection title='返回参数' toggleable>
            <ParamsConfig group='response' />
          </ParamsSection>
        </form>
      </FormProvider>

      <div className='flex items-center justify-end w-full h-64 bg-gray-100 px-20'>
        <Button onClick={history.goBack} iconName='close' className='mr-20'>取消</Button>
        <Button
          modifier='primary'
          iconName='check'
          loading={submitting}
          forbidden={submitting}
          onClick={onSubmit}
        >
          确认新建
        </Button>
      </div>
    </>
  );
}

export default observer(AddApi);
