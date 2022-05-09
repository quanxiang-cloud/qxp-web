import toast from '@lib/toast';

import { LOGIC_OPERATOR } from './constants';

export function parseToExpression(expr: string, variables: string[]): string {
  return expr.split(' ').map((value) => {
    const variableMatch = value.split(/\s*[|&(!)=]+\s*/).find((val) => !!val);
    // value maybe has symbol of '.' or '[]'
    const variable = variableMatch?.split('.')[0]?.split('[')[0] || '';

    const _value = variables.includes(variable) ? value.replace(variable, `states['${variable}']`) : value;

    return _value;
  }).join(' ');
}

export function parseToExpressionStr(expr: string): string {
  return expr.split(' ').map((value: string) => {
    if (!LOGIC_OPERATOR.includes(value)) {
      if (!value) {
        return;
      }
      // to get variable
      const variableMatch = value.split(/\s*[|&(!)=]+\s*/).find((val) => !!val);
      const variableExp = variableMatch?.split('.')[0].split(']')[0] + ']';

      return value.replace(variableExp, variableExp.split('\'')[1]);
    }

    return value;
  }).join(' ');
}

export function confirmExpressionStr(expr: string): boolean {
  const match = expr.match(/states\['(.+)'\]/i);
  if (!match || !match[1]) {
    toast.error(`无效的表达式: ${expr}`);
    return false;
  }

  return true;
}
