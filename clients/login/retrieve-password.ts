import { isPassword } from '@lib/utils';

import User, { IUser } from './user';
import Password from './password-field';
import Captcha from './captcha-field';
import { IInputField, query, parseUserValidateResult } from './atom';

import './style.scss';

interface IRetrieveUser extends IUser {
  newPassword: IInputField;
  captcha: IInputField;
}

class RetrieveUser extends User {
  private newPassword: Password;
  private captcha: Captcha;

  constructor({ newPassword, username, captcha, action }: IRetrieveUser) {
    super({ username, action });
    this.captcha = new Captcha(captcha, action, this.onValidateAll.bind(this));
    if (this.username) {
      this.captcha.setUserName(this.username);
    }
    this.newPassword = new Password(newPassword, action, this.onValidateAll.bind(this));
  }

  onValidateAll(context: Password, isValid: boolean): boolean | (boolean | Promise<boolean>)[] {
    if (!this.newPassword || !this.username || !this.captcha || !isValid) {
      return false;
    }
    return (
      [this.newPassword, this.username, this.captcha]
        .filter((i) => i !== context)
        .map((i) => i.validate())
    );
  }

  validate(): boolean | Promise<boolean> {
    if (this.username) {
      return parseUserValidateResult(
        this.username.validate(),
        this.captcha.validate(),
        this.newPassword.validate(),
      );
    }
    return parseUserValidateResult(
      this.captcha.validate(),
      this.newPassword.validate(),
    );
  }
}

function customeValidator(value: string) {
  if (value && !isPassword(value)) {
    return '密码必须包含数字、字母和符号，长度至少为 8 位';
  }
  return '';
}

new RetrieveUser({
  username: {
    name: 'login:captcha:username',
    inputElement: query<HTMLInputElement>('input[name="username"]'),
    errorElement: query<HTMLElement>('.username-hints'),
  },
  captcha: {
    inputElement: query<HTMLInputElement>('input[name="captcha"]'),
    errorElement: query<HTMLInputElement>('.captcha-hints'),
    actionElement: query<HTMLButtonElement>('.send'),
    url: '/api/v1/org/forget/code',
  },
  newPassword: {
    name: 'reset:password:newPassword',
    inputElement: query<HTMLInputElement>('input[name="newPassword"]'),
    errorElement: query<HTMLElement>('.newPassword-hints'),
    customeValidator,
  },
  action: query<HTMLButtonElement>('.btn-retrieve'),
});
