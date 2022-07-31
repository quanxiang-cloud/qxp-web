import { parse, Node } from 'acorn';

import toast from '@lib/toast';

import { VariableBindConf } from '.';
import { LOGIC_OPERATOR } from './constants';

export function parseToExpression(expr: string, variables: string[]): string {
  return expr.split(' ').map((value) => {
    const variableMatch = value.split(/\s*[|&(!)=]+\s*/).find((val) => !!val);
    // value maybe has symbol of '.' or '[]'
    const variable = variableMatch?.split('.')[0]?.split('[')[0] || '';

    const _value = variables.includes(variable) ? value.replace(variable, `state['${variable}']`) : value;

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

export function getFnBody(ast: AstNode, fnString: string): string {
  const [firstNode] = ast.body;
  const { body } = firstNode as any;
  return fnString.slice(body.start + 1, body.end - 1);
}

export function toConvertorProp({ type, contentStr }: VariableBindConf): any {
  if (type === 'convertor') {
    return {
      type: 'state_convertor_func_spec',
      args: 'state',
      body: contentStr,
    };
  }

  return {
    type: 'state_convert_expression',
    expression: contentStr,
  };
}

export function generateInitFunString({ name = '', args = '', notes = '', body = '' }): string {
  const defaultNotes =
`/*
  * JavaScript expressions are executed as functions
  * so ensure that your expression returns a value
*/`;
  return `${defaultNotes}
function ${name}(${args}) {${body}}`;
}

type AstNode = Node & { body: Node[] }

export function parseAst(fnString: string): AstNode {
  return parse(fnString, {
    ecmaVersion: 'latest',
    sourceType: 'script',
  }) as AstNode;
}

export function validateConvertor(fnString: string): boolean {
  try {
    const parseAst = parse(fnString, {
      ecmaVersion: 'latest',
      sourceType: 'script',
    });
    return isFunctionValid(parseAst as AstNode);
  } catch (e) {
    toast.error(e || '非法的函数定义');
    return false;
  }
}

export function isFunctionValid(ast: AstNode): boolean {
  if (!ast.body.length) {
    throw new Error('不存在处理函数');
  }

  if (ast.body.length > 1) {
    throw new Error('所有内容都应该定义在函数体内');
  }
  const [firstNode] = ast.body;
  if (firstNode.type !== 'FunctionDeclaration') {
    throw new Error('不存在处理函数');
  }

  return true;
}
