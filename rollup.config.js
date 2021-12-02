import spaPageConfig from './rollup-configs/page-render-by-client';
import staticPages from './rollup-configs/page-render-by-server';

export default (commandLineArgs) => {
  if (commandLineArgs.input) {
    spaPageConfig.input = Object.entries(spaPageConfig.input).filter(([name]) => {
      return commandLineArgs.input.includes(name);
    }).reduce((input, [name, filePath]) => {
      input[name] = filePath;
      return input;
    }, {});

    delete commandLineArgs.input;
  }

  return [...staticPages, spaPageConfig]
};
