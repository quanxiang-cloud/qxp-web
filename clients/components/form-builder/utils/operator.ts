import { compareOperatorMap } from '@c/form-builder/constants';
import elements from '../registry/elements';

export function getSourceElementOperator(elementName: string): FormBuilder.CompareOperator[] | undefined {
  return elements[elementName.toLocaleLowerCase()]?.compareOperators;
}

export function getCompareOperatorOptions(operators: FormBuilder.CompareOperator[]): Array<{label: any, value: any}> {
  return operators.map((operator) => {
    return { label: compareOperatorMap[operator].title, value: operator };
  });
}
