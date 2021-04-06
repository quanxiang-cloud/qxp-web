import { IInputField, query, parseValidateAllResult, parseUserValidateResult } from '@clients/login/atom';

import User, { IUser } from './user';
import Password from './password-field';

import './style.scss';

interface IResetUser extends IUser {
  oldPassword: IInputField;
  newPassword: IInputField;
  checkPassword: IInputField;
}

class ResetUser extends User {
  private oldPassword: Password;
  private newPassword: Password;
  private checkPassword: Password;

  constructor({ oldPassword, newPassword, checkPassword, action }: IResetUser) {
    super({ action });
    this.oldPassword = new Password(oldPassword, action, this.onValidateAll.bind(this));
    this.newPassword = new Password(newPassword, action, this.onValidateAll.bind(this));
    this.checkPassword = new Password(checkPassword, action, this.onValidateAll.bind(this));
    const that = this;

    this.checkPassword.validate = function(checkAll?: boolean) {
      let isValid = true;
      if ((this.value as string).length < 6) {
        if (this.value !== '') {
          this.errMessage = '密码至少为6位';
          isValid = false;
        }
        this.action.classList.add('disabled');
      }
      if ((this.value as string) !== (that.newPassword.value as string)) {
        if (this.value !== '') {
          isValid = false;
          if (that.newPassword.value) {
            this.errMessage = '两次输入的新密码不匹配';
          }
        }

        this.action.classList.add('disabled');
      }

      if (isValid) {
        this.errMessage = '';
      }
      if (this.value === '') {
        isValid = false;
      }
      (this.errorElement as HTMLElement).textContent = this.errMessage as string;

      if (checkAll) {
        const onValidateAllResult: boolean | (boolean | Promise<boolean>)[] = this.onValidateAll(
          this, isValid
        );
        if (onValidateAllResult instanceof Array) {
          parseValidateAllResult(onValidateAllResult, this.errorElement).then((isAllValid) => {
            isAllValid && this.action.classList.remove('disabled');
          });
        } else if (onValidateAllResult) {
          this.action.classList.remove('disabled');
        }
      }
      return isValid;
    };

    this.checkPassword.validate(true);
  }

  onValidateAll(context: Password, isValid: boolean): boolean | (boolean | Promise<boolean>)[] {
    if (!this.oldPassword || !this.newPassword || !this.checkPassword || !isValid) {
      return false;
    }
    return (
      [this.oldPassword, this.newPassword, this.checkPassword]
        .filter((i) => i !== context)
        .map((i) => i.validate())
    );
  }

  validate(): boolean | Promise<boolean> {
    return parseUserValidateResult(
      this.oldPassword.validate(),
      this.newPassword.validate(),
      this.checkPassword.validate(),
    );
  }
}

new ResetUser({
  oldPassword: {
    name: 'reset:password:oldPassword',
    inputElement: query<HTMLInputElement>('input[name="oldPassword"]'),
    errorElement: query<HTMLElement>('.oldPassword-hints'),
  },
  newPassword: {
    name: 'reset:password:newPassword',
    inputElement: query<HTMLInputElement>('input[name="newPassword"]'),
    errorElement: query<HTMLElement>('.newPassword-hints'),
  },
  checkPassword: {
    name: 'reset:password:checkPassword',
    inputElement: query<HTMLInputElement>('input[name="checkPassword"]'),
    errorElement: query<HTMLElement>('.checkPassword-hints'),
  },
  action: query<HTMLButtonElement>('.btn-reset'),
});
