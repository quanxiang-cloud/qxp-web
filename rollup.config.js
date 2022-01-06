import spaPageConfigs from './rollup-configs/page-render-by-client';
import staticPages from './rollup-configs/page-render-by-server';

export default (commandLineArgs) => {
  let configs = spaPageConfigs;
  if (commandLineArgs.input) {
    configs = spaPageConfigs.map((config) => {
      config.input = Object.entries(config.input).filter(([name]) => {
        return commandLineArgs.input.includes(name);
      }).reduce((input, [name, filePath]) => {
        input[name] = filePath;
        return input;
      }, {});
      return config;
    }).filter((config) => {
      return Object.keys(config.input).length;
    });

    delete commandLineArgs.input;
  }

  return [...staticPages, ...configs];
};
