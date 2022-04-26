import { observable, action, computed } from 'mobx';

import { parseJSON } from '@lib/utils';
import {
  parseTokenValues,
  updateTokenInputToToken,
  stringifyTokens,
} from './utils/parse';
import { replaceReferences } from './utils/aliases';
import { AnyTokenList, Token, TokenTypeSchema } from './types/token';
import {
  SetTokenInput,
  UpdateTokenInput,
  DeleteTokenInput,
} from './types/input';
import { mergeTokenGroups, resolveTokenValues } from './utils/token-helper';
import { mappedTokens } from './utils';
import { generateCss } from './utils/css';
import { TokenTypes } from './constants/constants-types';
import defaultJSON from './config/default.json';

export const GLOBAL_SET = 'global';

export type TokenEdited<T extends Token> = {
  initialName: string;
  isPristine: boolean;
  options: {
    type: TokenTypes;
    description?: string;
  }
} & Omit<TokenTypeSchema, 'label'> & Pick<T, 'name' | 'value' | 'unit'>;

const defaultTokens: any = {
  version: 'v0.1.0',
  values: defaultJSON,
};

export default class DesignTokenStore {
  @observable isGlobalEditable = false;
  @observable tokens: Record<string, AnyTokenList> = { global: [] };
  @observable tokenFilter = '';
  @observable activeTokenSet = GLOBAL_SET;
  @observable hasUnsavedChanges = false;
  @observable usedTokenSet: string[] = [GLOBAL_SET];
  @observable tokenToBeEdited: TokenEdited<Token> | null = null;

  constructor({ tokenData, isGlobalEditable = false }: { tokenData: string, isGlobalEditable?: boolean }) {
    this.isGlobalEditable = isGlobalEditable;
    const values = tokenData ? parseJSON(tokenData, defaultTokens.values) : defaultTokens.values;
    this.setTokenData({ values: values });
  }
  @computed get isEditDisabled() {
    if (this.activeTokenSet === GLOBAL_SET) {
      return !this.isGlobalEditable;
    }
    return false;
  }

  @computed get resolvedTokens() {
    return resolveTokenValues(mergeTokenGroups(this.tokens, [...this.usedTokenSet, this.activeTokenSet]));
  }

  @computed get resolvedUsedTokens() {
    return resolveTokenValues(mergeTokenGroups(this.tokens, [...this.usedTokenSet]));
  }

  @computed get memoizedTokens() {
    if (this.tokens[this.activeTokenSet]) {
      return mappedTokens(this.tokens[this.activeTokenSet], this.tokenFilter);
    }
    return [];
  }

  @action
  setTokenFilter = (keyword: string): void => {
    this.tokenFilter = keyword;
  };

  @action
  resetGlobal = (): void => {
    const values = parseTokenValues(defaultTokens.values);
    this.tokens = {
      ...this.tokens,
      ...values,
    };
  };

  @action
  setHasUnsavedChanges = (bool: boolean): void => {
    this.hasUnsavedChanges = bool;
  };

  @action
  setTokenToBeEdited = <T extends Token>(token: TokenEdited<T>): void => {
    this.tokenToBeEdited = token;
  };

  @action
  toggleUsedTokenSet = (tokenSet: string): void => {
    this.usedTokenSet = this.usedTokenSet.includes(tokenSet) ?
      [...this.usedTokenSet.filter((n) => n !== tokenSet)] :
      [...new Set([...this.usedTokenSet, tokenSet])];
  };

  @action
  setUsedTokenSet = (tokenSets: string[]): void => {
    this.usedTokenSet = tokenSets;
  };

  @action
  setActiveTokenSet = (tokenSet: string): void => {
    this.activeTokenSet = tokenSet;
  };

  @action
  addTokenSet = (tokenSet: string): void => {
    if (tokenSet in this.tokens) {
      return;
    }

    this.tokens = {
      ...this.tokens,
      [tokenSet]: [],
    };
  };

  @action
  deleteTokenSet = (tokenSet: string): void => {
    Reflect.deleteProperty(this.tokens, tokenSet);
  };

  @action
  renameTokenSet = (oldName: string, newName: string): void => {
    if (Object.keys(this.tokens).includes(newName) && oldName !== newName) {
      return;
    }

    this.tokens[newName] = this.tokens[oldName];
    Reflect.deleteProperty(this.tokens, oldName);
  };

  @action
  duplicateTokenSet = (tokenSet: string): void => {
    const allTokenSets = Object.keys(this.tokens);
    const existingTokenSet = allTokenSets.find((key: string) => key === tokenSet);

    if (existingTokenSet) {
      let index = 0;
      let newSetName = `${tokenSet}-copy${index}`;
      while (allTokenSets.find((key: string) => key === newSetName)) {
        index = index + 1;
        newSetName = `${tokenSet}-copy${index}`;
      }
      this.tokens = {
        ...this.tokens,
        [newSetName]: this.tokens[tokenSet],
      };
    }
  };

  @action
  setTokenData = (data: SetTokenInput): void => {
    const values = parseTokenValues(data.values);
    this.tokens = values;
    this.setActiveTokenSet(GLOBAL_SET);
    this.setUsedTokenSet([GLOBAL_SET]);
  };

  @action
  setJSONData = (jsonData: string): void => {
    const parsedTokens = parseJSON(jsonData, []);
    const values = parseTokenValues({ [this.activeTokenSet]: parsedTokens });
    this.tokens = {
      ...this.tokens,
      ...values,
    };
  };

  @action
  setTokens = (tokens: Record<string, AnyTokenList>): void => {
    this.tokens = tokens;
  };

  @action
  createToken = (data: UpdateTokenInput): void => {
    let newTokens: Record<string, AnyTokenList> = {};
    const existingToken = this.tokens[data.parent].find(
      (n) => n.name === data.name,
    );
    if (!existingToken) {
      newTokens = {
        [data.parent]: [
          ...this.tokens[data.parent],
          updateTokenInputToToken(data),
        ],
      };
    }

    this.tokens = {
      ...this.tokens,
      ...newTokens,
    };
  };

  @action
  duplicateToken = (data: UpdateTokenInput): void => {
    let newTokens: Record<string, AnyTokenList> = {};
    const existingTokenIndex = this.tokens[data.parent].findIndex(
      (n) => n.name === data.name,
    );
    if (existingTokenIndex > -1) {
      let index = 0;
      let newName = `${data.name}-copy${index}`;
      while (this.tokens[data.parent].find((n) => n.name === newName)) {
        index = index + 1;
        newName = `${data.name}-copy${index}`;
      }
      const existingTokens = this.tokens[data.parent];
      existingTokens.splice(existingTokenIndex + 1, 0, {
        ...this.tokens[data.parent][existingTokenIndex],
        name: newName,
      });

      newTokens = {
        [data.parent]: existingTokens,
      };
    }

    this.tokens = {
      ...this.tokens,
      ...newTokens,
    };
  };

  @action
  updateToken = (data: UpdateTokenInput): void => {
    const name = data.oldName ? data.oldName : data.name;
    const index = this.tokens[data.parent].findIndex(
      (token) => token.name === name,
    );
    const newArray = [...this.tokens[data.parent]];
    newArray[index] = {
      ...newArray[index],
      ...updateTokenInputToToken(data),
    } as Token;

    this.tokens = {
      ...this.tokens,
      [data.parent]: newArray,
    };

    // change reference
    if (data.oldName) {
      this.updateAliases(data.oldName, data.name);
    }
  };

  @action
  deleteToken = (data: DeleteTokenInput): void => {
    this.tokens = {
      ...this.tokens,
      [data.parent]: this.tokens[data.parent].filter(
        (token) => token.name !== data.path,
      ),
    };
  };

  @action
  deleteTokenGroup = (data: DeleteTokenInput): void => {
    this.tokens = {
      ...this.tokens,
      [data.parent]: this.tokens[data.parent].filter(
        (token) => !(token.name as string).startsWith(data.path),
      ),
    };
  };

  @action
  updateAliases = (oldName: string, newName: string): void => {
    this.tokens = Object.entries(this.tokens).reduce<Record<string, AnyTokenList>>(
      (acc, [key, values]) => {
        const newValues = values.map<Token>((token) => {
          if (Array.isArray(token.value)) {
            return {
              ...token,
              value: token.value.map((t) =>
                Object.entries(t).reduce<Record<string, string>>(
                  (a, [k, v]) => {
                    a[k] = replaceReferences(v, oldName, newName);
                    return a;
                  },
                  {},
                ),
              ),
            } as Token;
          }
          if (typeof token.value === 'object') {
            return {
              ...token,
              value: Object.entries(token.value).reduce<Record<string, string>>((a, [k, v]) => {
                a[k] = replaceReferences(v, oldName, newName);
                return a;
              }, {}),
            } as Token;
          }
          return {
            ...token,
            value: replaceReferences(token.value, oldName, newName),
          } as Token;
        });

        acc[key] = newValues;
        return acc;
      },
      {},
    );
  };

  getStringTokens = (): string => {
    if (!this.activeTokenSet) {
      return '';
    }

    return stringifyTokens(this.tokens, [this.activeTokenSet]);
  };

  getAllStringTokens = (): string => {
    return stringifyTokens(this.tokens, Object.keys(this.tokens), true);
  };

  generateCssString = (): string => {
    return generateCss(this.resolvedUsedTokens);
  };
}
