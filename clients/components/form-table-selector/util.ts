import last from 'lodash/last';
import groupBy from 'lodash/groupBy';

import { Options } from './api';

export function getCascaderValuePathFromValue(
  value: string,
  options: Options = [],
  parentPath: string[] = [],
): string[] {
  const { true: groupOptions, false: pageOptions } = groupBy(options, ({ isGroup }) => !!isGroup);
  const pageOption = pageOptions?.find((option) => option.value === value);
  if (pageOption) {
    return [...parentPath, value];
  }
  const valuePaths = groupOptions?.map((option) => {
    return getCascaderValuePathFromValue(value, option.children, [...parentPath, option.value]);
  });
  const matched = valuePaths?.find((valuePath) => last(valuePath) === value);
  const optionsResult = matched || [value];
  return optionsResult.filter((val) => !!val);
}
