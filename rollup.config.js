import spaPageConfig, { output } from './rollup-configs/page-render-by-client';
import staticPages from './rollup-configs/page-render-by-server';

export default [...staticPages, { ...spaPageConfig, output }];
