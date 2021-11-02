const tmpl = `
{
  "swagger": "2.0",
  "info": {
    "title": "Sample API",
    "description": "API description",
    "version": "1.0.0"
  },
  "host": "api.example.com",
  "basePath": "/v1",
  "schemes": [
    "https"
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "Returns a list of users.",
        "description": "",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  }
}
`;

/**
 * swagger2.0 spec parser
 *
 */
class SwaggerParser {
  /**
   * currently support swagger 2.0 and openapi 3.0
   * @see https://swagger.io/docs/specification/2-0/basic-structure/
   */
  supportSpecs=['swagger2'];

  /**
   * parameter details
   * @see https://swagger.io/docs/specification/2-0/describing-parameters/
   */
  in=['query', 'path', 'body', 'header'];

  constructor() {

  }

  setInfo() {

  }

  setParameters() {

  }

  setResponse() {

  }

  toJson() {

  }
}

export default SwaggerParser;
