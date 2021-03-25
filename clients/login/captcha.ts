import { IInputField, query } from 'clients/assets/lib/atom';

import UserName from './username';
import Captcha from './captcha-field';
import Page from './page';
import User, { IUser } from './user';

import './style.scss';

interface ICaptchaUser extends IUser {
  captcha: IInputField;
}

class CaptchaUser extends User {
  private captcha: Captcha;

  constructor({ action, username, captcha }: ICaptchaUser) {
    super({ username, action });
    this.captcha = new Captcha(captcha, action, this.onValidateAll.bind(this));
    if (this.username) {
      this.captcha.setUserName(this.username);
    }
  }

  onValidateAll(context: UserName | Captcha, isValid: boolean): boolean {
    if (!this.username || !this.captcha) {
      return false;
    }
    return (
      [this.username, this.captcha].filter((i) => i !== context).every((i) => i.validate()) &&
      isValid
    );
  }

  validate(): boolean {
    if (this.username) {
      return this.username.validate() && this.captcha.validate();
    }
    return this.captcha.validate();
  }
}

new Page();
new CaptchaUser({
  username: {
    name: 'login:captcha:username',
    inputElement: query<HTMLInputElement>('input[name="username"]'),
    errorElement: query<HTMLElement>('.username-hints'),
  },
  captcha: {
    name: 'login:captcha:captcha',
    inputElement: query<HTMLInputElement>('input[name="captcha"]'),
    errorElement: query<HTMLInputElement>('.captcha-hints'),
    actionElement: query<HTMLButtonElement>('button.send'),
    url: '/api/v1/org/login/code',
  },
  action: query<HTMLButtonElement>('.btn-login'),
});
