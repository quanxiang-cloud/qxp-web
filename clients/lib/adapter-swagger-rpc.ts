import { AjaxConfig, FetchParams, SwaggerSpecAdapter } from '@one-for-all/api-spec-adapter';
import { Spec } from '@one-for-all/api-spec-adapter/lib/src/swagger-schema-official';

type Response = {
  body?: any;
  error?: Error;
}

type Options = {
  __disableResponseAdapter?: boolean;
}

export default class SwaggerRPCSpecAdapter extends SwaggerSpecAdapter {
  options: Options | undefined;

  constructor(spec: Spec, options?: Options) {
    super(spec);

    this.options = options;
  }

  build(apiID: string, fetchParams?: FetchParams): AjaxConfig | undefined {
    const ajaxConfig = SwaggerSpecAdapter.prototype.build.call(this, apiID, fetchParams);

    if (ajaxConfig) {
      ajaxConfig.headers = { ...ajaxConfig.headers, 'x-proxy': 'API' };
    }

    return ajaxConfig;
  }

  // responseAdapter = ({ body, error }: Response): Res => {
  //   if (this.options?.__disableResponseAdapter) {
  //     return { result: body, error };
  //   }

  //   if (error || !body) {
  //     return { result: body, error };
  //   }

  //   if (body.code !== 0) {
  //     const e = new Error(body.msg);
  //     if (body.data) {
  //       Object.assign(e, { data: body.data });
  //     }
  //     return { result: undefined, error: e };
  //   }

  //   return { result: body.data, error: undefined };
  // };
}
