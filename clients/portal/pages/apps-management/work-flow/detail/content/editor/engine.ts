/* eslint-disable no-console */
type Config = (string | Config)[];

interface EngineConfig {
  config: Config;
  functions: Record<string, Function>;
}

export interface Params {
  [key: string]: unknown;
  debug?: {
    mode: 'ONLY_DEBUG' | 'ONLY_CONSOLE';
    disableNodes?: string[];
  }
}

class FlowEngine {
  functions: Record<string, Function>;

  constructor() {
    this.functions = {};
  }

  async execute(engineConfig: EngineConfig | Config, params: Params) {
    if (!engineConfig) {
      return;
    }
    const { config, functions } = engineConfig as EngineConfig;
    if (functions) {
      this.functions = functions;
    }
    try {
      return await this.flow(0, config || engineConfig, params);
    } catch (e) {
      console.error('执行函数 execute 异常: %s, 配置: %s, 参数: %s}', e, config, params);
    }
  }

  async flow(index: number, config: Config, params: Params): Promise<any> {
    if (config[index]) {
      const next = index + 1;
      return await this.exec(
        config[index],
        params,
        config[next] ? (params: Params) => this.flow(next, config, params) : null
      );
    }
  }

  async exec(
    funcNameStrOrArr: string | Config,
    params: Params,
    callback: null | ((params: Params) => Promise<any>),
  ) {
    const funcNames = Array.isArray(funcNameStrOrArr) ? funcNameStrOrArr : [funcNameStrOrArr];
    const asyncResults = funcNames.map((funcName) => {
      return new Promise(async (resolve, reject) => {
        if (Array.isArray(funcName)) {
          return resolve(await this.execute(funcName, params));
        }
        const realFunc = this.functions[funcName];
        if (!realFunc) {
          console.error(`${funcName}函数不存在, 请 check 函数引用!`);
          return reject();
        }
        try {
          if (params.debug) {
            const { mode, disableNodes } = params.debug;
            if (['ONLY_DEBUG', 'ONLY_CONSOLE'].includes(mode)) {
              console.debug(`执行函数: ${funcName}, 参数: %s`, params);
            }
            if (mode === 'ONLY_DEBUG') {
              debugger;
            }
            if (disableNodes && disableNodes.includes(funcName)) {
              return reject();
            }
          }
          resolve(await realFunc(params));
        } catch (e) {
          console.error(`执行函数: ${funcName} 异常: %s, 参数: %s`, e, params);
        }
      });
    });
    const result = { ...params, ...(await Promise.race(asyncResults) as Params) };
    return callback ? await callback(result) : result;
  }
}

export default new FlowEngine();
