import { IInputField, query } from '@lib/atom';

import UserName from './username';
import Password from './password-field';
import User, { IUser } from './user';
import Page from './page';

import './style.scss';

interface IPasswordUser extends IUser {
  password: IInputField;
}

class PasswordUser extends User {
  private password: Password;

  constructor({ action, username, password }: IPasswordUser) {
    super({ username, action });
    this.password = new Password(password, action, this.onValidateAll.bind(this));
  }

  onValidateAll(context: UserName | Password, isValid: boolean): boolean {
    if (!this.username || !this.password) {
      return false;
    }
    return (
      [this.username, this.password].filter((i) => i !== context).every((i) => i.validate()) &&
      isValid
    );
  }

  validate(): boolean {
    if (this.username) {
      return this.username.validate() && this.password.validate();
    }
    return this.password.validate();
  }
}

new Page();
new PasswordUser({
  username: {
    name: 'login:password:username',
    inputElement: query<HTMLInputElement>('input[name="username"]'),
    errorElement: query<HTMLElement>('.username-hints'),
  },
  password: {
    name: 'login:password:password',
    inputElement: query<HTMLInputElement>('input[name="password"]'),
    errorElement: query<HTMLInputElement>('.password-hints'),
  },
  action: query<HTMLButtonElement>('.btn-login'),
});
