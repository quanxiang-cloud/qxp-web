import { IInputField } from '@lib/atom';

import Remember from './remember';
import UserName from './username';

export interface IUser {
  username?: IInputField;
  remember?: IInputField;
  action: HTMLButtonElement;
  asyncValidate?: boolean;
}

export default abstract class User {
  protected username?: UserName;
  protected action: HTMLButtonElement;
  protected isLoginValid?: boolean;

  constructor({ username, remember, action }: IUser) {
    if (remember) {
      new Remember(remember, action);
    }
    if (username) {
      this.username = new UserName(username, action, this.onValidateAll.bind(this));
    }
    this.action = action;
    this.bindEvents();
  }

  bindEvents() {
    this.action.onclick = this.login.bind(this);
  }

  login(e: Event): void | boolean {
    const target = e.target as HTMLButtonElement;
    if (!this.isLoginValid) {
      e.preventDefault();
    } else {
      return true;
    }

    const validateResult = this.validate();
    if (validateResult instanceof Promise) {
      validateResult.then((isValid) => {
        this.isLoginValid = isValid;
        isValid && target.click();
      });
    } else {
      this.isLoginValid = validateResult;
      validateResult && target.click();
    }
  }

  abstract onValidateAll(...args: unknown[]): boolean | (boolean | Promise<boolean>)[];

  abstract validate(): boolean | Promise<boolean>;
}
