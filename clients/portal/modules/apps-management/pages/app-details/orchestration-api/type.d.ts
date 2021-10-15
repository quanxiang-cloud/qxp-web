type APIParameterLocation = 'header' | 'body' | 'query';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type EditAPINamespacePropertyForm = Pick<APINamespace, 'protocol' | 'host' | 'id'>;

type PROTOCOL = 'HTTP' | 'HTTPS' | '';

interface APINamespace {
  name: string;
  id: string;
  protocol: PROTOCOL;
  host: string;
  description?: string;
  children?: Array<APINamespace>;
}
