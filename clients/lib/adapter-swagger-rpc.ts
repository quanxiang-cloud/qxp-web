import { AjaxConfig, FetchParams, Res, SwaggerSpecAdapter } from '@ofa/api-spec-adapter';

export default class SwaggerRPCSpecAdapter extends SwaggerSpecAdapter {
  build(apiID: string, fetchParams?: FetchParams): AjaxConfig | undefined {
    const ajaxConfig = SwaggerSpecAdapter.prototype.build.call(this, apiID, fetchParams);

    if (ajaxConfig) {
      ajaxConfig.headers = { ...ajaxConfig.headers, 'x-proxy': 'API' };
    }

    return ajaxConfig;
  }

  responseAdapter = ({ result, error }: Res): Res => {
    if (error || !result) {
      return { result, error };
    }

    if (result.code !== 0) {
      const e = new Error(result.msg);
      if (result.data) {
        Object.assign(e, { data: result.data });
      }
      return { result: undefined, error: e };
    }

    return { result: result.data, error: undefined };
  }
}
