type ApiStatus = 0 | 1; // 0: 未激活，1: 已激活

declare namespace PolyAPI {
  interface Namespace {
    id: string;
    owner: string;
    ownerName: string;
    parent: string;
    name: string;
    subCount: number;
    title: string;
    desc: string;
    active: ApiStatus;
    createAt: string;
    updateAt: string;
  }

  interface Service {
    id: string;
    owner: string;
    ownerName: string;
    fullPath: string;
    title: string;
    desc: string;
    active: ApiStatus,
    schema: 'http' | 'https',
    host: string;
    authType: 'none' | 'signature',
    authContent: string;
    createAt: string;
    updateAt: string;
  }

  interface Api extends Namespace {
    fullPath: string; // 代理路径
    url: string; // 原始路径
    version: string;
    method: string;
    action: string;
  }

  interface NativeApi {
    id: string;
    url: string;
    namespace: string;
    name: string;
    title: string;
    desc: string;
    active: number;
    service: string;
    schema: string;
    host: string;
    authType: string;
    updateAt: string;
  }

  type CreateApiParams={
    version: string;
    namespace?: string;
    swagger: string;
  }

  type UploadApiParams={
    version: string;
    namespace: string;
    file: string;
  }

  type CreateApiResult={
    id: string; // api uuid
    path: string;
  }

  type DocType = 'raw' | 'swag' | 'curl' | 'javascript' | 'python';

  type ApiDocParams={
    docType: DocType;
    titleFirst?: boolean;
    _hide?: Record<string, any>;
    _signature?: {
      timestamp: string;
      version: number;
      method: string;
      access_key_id: string;
    }
  }

  type QueryApiDocResult={
    docType: string;
    name: string;
    id: string;
    doc: Record<string, any>;
  }

  type CreateServiceParams={
    schema: string;
    host: string;
    authType: string;
    authorize: string;
    name: string;
  }

  type CreateNamespaceParams={
    name: string;
    title: string;
    desc?: string;
  }

  type ApiKeyParams = {
    service: string;
    keyID: string;
    keySecret: string;
    description?: string;
  }
  type ApiKeyList={
    id: string,
    keyID: string,
    keySecret: string,
    description: string,
    active: number,
    createAt: string,
  };

  type CreateServiceResult = Omit<Service, 'owner'>
}
