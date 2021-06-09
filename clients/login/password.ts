import { IInputField, query, parseUserValidateResult } from './atom';

import UserName from './username';
import Password from './password-field';
import User, { IUser } from './user';

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

  onValidateAll(
    context: UserName | Password,
    isValid: boolean,
  ): boolean | (boolean | Promise<boolean>)[] {
    if (!this.username || !this.password || !isValid) {
      return false;
    }
    return (
      [this.username, this.password].filter((i) => i !== context).map((i) => i.validate())
    );
  }

  validate(): boolean | Promise<boolean> {
    if (this.username) {
      return parseUserValidateResult(
        this.username.validate(),
        this.password.validate(),
      );
    }
    return this.password.validate();
  }
}
function customeValidator(value: string ) {
  if (value === '') {
    return '密码不能为空';
  }
  return '';
}

new PasswordUser({
  username: {
    name: 'login:password:username',
    inputElement: query<HTMLInputElement>('input[name="username"]'),
    errorElement: query<HTMLElement>('.username-hints'),
    asyncValidate: true,
  },
  password: {
    name: 'login:password:password',
    inputElement: query<HTMLInputElement>('input[name="password"]'),
    errorElement: query<HTMLInputElement>('.password-hints'),
    customeValidator,
  },
  action: query<HTMLButtonElement>('.btn-login'),
});
