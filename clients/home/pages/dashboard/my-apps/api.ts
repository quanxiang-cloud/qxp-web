import { Spec } from '@ofa/api-spec-adapter/lib/src/swagger-schema-official';

const spec: Spec = {
  swagger: 'some_version',
  info: {
    contact: {
      email: 'Stephane.Carrez@gmail.com',
    },
    description: 'Todo API',
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
    termsOfService: 'https://todo.vacs.fr/terms/',
    title: 'Todo API',
    version: '1.0.0',
  },
  paths: {
    '/api/v1/app-center/userList': {
      post: {
        parameters: [
          {
            name: 'root',
            in: 'body',
            schema: {
              type: 'object',
              title: 'empty object',
              properties: {
                appName: {
                  type: 'string',
                },
                page: {
                  type: 'integer',
                },
                limit: {
                  type: 'integer',
                },
              },
              required: [
                'appName',
                'page',
                'limit',
              ],
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};

export default spec;
