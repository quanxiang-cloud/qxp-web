import { AjaxConfig, FetchParams, Res, SwaggerSpecAdapter } from '@ofa/api-spec-adapter';

type Response = {
  body?: any;
  error?: Error;
}

export default class SwaggerRPCSpecAdapter extends SwaggerSpecAdapter {
  build(apiID: string, fetchParams?: FetchParams): AjaxConfig | undefined {
    const ajaxConfig = SwaggerSpecAdapter.prototype.build.call(this, `post:${apiID}`, fetchParams);

    if (ajaxConfig) {
      ajaxConfig.headers = { ...ajaxConfig.headers, 'x-proxy': 'API' };
    }

    return ajaxConfig;
  }

  responseAdapter = ({ body, error }: Response): Res => {
    if (error || !body) {
      return { result: body, error };
    }

    if (body.code !== 0) {
      const e = new Error(body.msg);
      if (body.data) {
        Object.assign(e, { data: body.data });
      }
      return { result: undefined, error: e };
    }

    return { result: body.data, error: undefined };
  }
}
