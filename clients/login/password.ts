import { IInputField, query } from 'clients/assets/lib/atom'

import UserName from './username'
import Password from './password-field'
import User, { IUser } from './user'
import Page from './page'

import './style.scss';

interface IPasswordUser extends IUser {
  password: IInputField;
}

class PasswordUser extends User {
  private password: Password

  constructor({ remember, action, username, password }: IPasswordUser) {
    super({ username, remember, action })
    this.password = new Password(password, action, this.onValidateAll.bind(this))
  }

  onValidateAll(context: UserName | Password, isValid: boolean): boolean {
    if(!this.username || !this.password) {
      return false
    }
    return [this.username, this.password].filter(i => i !== context).every(i => i.validate()) && isValid
  }

  validate(): boolean {
    return this.username.validate() && this.password.validate()
  }
}

new Page()
new PasswordUser({
  username: {
    name: 'login:password:username', 
    inputElement: query<HTMLInputElement>('input[name="username"]'), 
    errorElement: query<HTMLElement>('.username-hints') 
  },
  password: {
    name: 'login:password:password', 
    inputElement: query<HTMLInputElement>('input[name="password"]'), 
    errorElement: query<HTMLInputElement>('.password-hints') 
  },
  remember: {
    name: 'login:password:remember',
    inputElement: query<HTMLInputElement>('input[name="remember"]'),
  },
  action: query<HTMLButtonElement>('.btn-login')
})
