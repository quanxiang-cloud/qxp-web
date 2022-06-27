import React from 'react';

import { Token } from '../types/token';
import Tooltip from '@c/tooltip';
import { TokenBoxshadowValue, TokenTypograpyValue } from '../types/values';
import store from '../../store';
import DesignTokenStore from '../store';
import { ResolvedToken } from '../utils/token-helper';

function getTokenValue(name: string, resolved: ResolvedToken<Token>[]): Token {
  return resolved.find((t: Token) => t.name === name) as Token;
}

function SingleShadow({
  shadow,
}: {
  shadow: TokenBoxshadowValue;
}): JSX.Element {
  return (
    <div className="flex flex-col mb-2">
      <div className="flex">{shadow.type}</div>
      <div className="flex">
        {shadow.x} {shadow.y} {shadow.blur} {shadow.spread} {shadow.color}
      </div>
    </div>
  );
}

function TokenTooltip({ token }: { token: Token }): JSX.Element | null {
  try {
    const { resolvedTokens } = store.designTokenStore as DesignTokenStore;
    const tokenValue = getTokenValue(token.name, resolvedTokens)?.value;

    if (token.type === 'typography') {
      return (
        <div>
          {Object.values(tokenValue as TokenTypograpyValue).map((value) => (
            <>
              {value}
              <br />
            </>
          ))}
        </div>
      );
    }

    if (token.type === 'boxShadow') {
      return Array.isArray(tokenValue) ? (
        <div>
          {(tokenValue as TokenBoxshadowValue[]).map((t, index) => (
            <SingleShadow key={`shadow-${token.name}-${index}`} shadow={t} />
          ))}
        </div>
      ) : (
        <SingleShadow shadow={tokenValue as TokenBoxshadowValue} />
      );
    }

    return <div>{tokenValue}</div>;
  } catch (e) {
    return null;
  }
}

export default function TokenTooltipWrapper({
  children,
  token,
}: {
  token: Token;
  children: React.ReactElement;
}): JSX.Element {
  return (
    <Tooltip
      position="bottom"
      label={
        (<div>
          <div className="text-xs font-bold text-gray-500">
            {token.name.split('.').slice(-1)[0]}
          </div>
          <TokenTooltip token={token} />
          {token.description && (
            <div className="text-gray-500">{token.description}</div>
          )}
        </div>)
      }
    >
      {children}
    </Tooltip>
  );
}
