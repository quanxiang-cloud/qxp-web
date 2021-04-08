import { IInputField, query, parseUserValidateResult } from './atom';

import User, { IUser } from './user';
import Password from './password-field';

import './style.scss';

interface IResetUser extends IUser {
  oldPassword: IInputField;
  newPassword: IInputField;
}

class ResetUser extends User {
  private oldPassword: Password;
  private newPassword: Password;

  constructor({ oldPassword, newPassword, action }: IResetUser) {
    super({ action });
    this.oldPassword = new Password(oldPassword, action, this.onValidateAll.bind(this));
    this.newPassword = new Password(newPassword, action, this.onValidateAll.bind(this));
  }

  onValidateAll(context: Password, isValid: boolean): boolean | (boolean | Promise<boolean>)[] {
    if (!this.newPassword || !this.oldPassword || !isValid) {
      return false;
    }
    return (
      [this.newPassword, this.oldPassword]
        .filter((i) => i !== context)
        .map((i) => i.validate())
    );
  }

  validate(): boolean | Promise<boolean> {
    return parseUserValidateResult(
      this.oldPassword.validate(),
      this.newPassword.validate(),
    );
  }
}

// function customeValidator(value: string) {
//   if (value && !isPassword(value)) {
//     return '密码必须包含数字、字母和符号，长度至少为 8 位';
//   }
//   return '';
// }

new ResetUser({
  oldPassword: {
    name: 'reset:password:oldPassword',
    inputElement: query<HTMLInputElement>('input[name="oldPassword"]'),
    errorElement: query<HTMLElement>('.oldPassword-hints'),
    // customeValidator,
  },
  newPassword: {
    name: 'reset:password:newPassword',
    inputElement: query<HTMLInputElement>('input[name="newPassword"]'),
    errorElement: query<HTMLElement>('.newPassword-hints'),
    // customeValidator,
  },
  action: query<HTMLButtonElement>('.btn-reset'),
});
