import { imgChange, removeError, validateUsername } from './login-common';
import './style.scss';

window.onload = function() {
  const username = document.querySelector('#username') as HTMLInputElement;
  const password = document.querySelector('#password') as HTMLInputElement;
  const nameMessage = document.querySelector('#nameMessage') as HTMLElement;
  const pwdMessage = document.querySelector('#pwdMessage') as HTMLElement;
  const pwdImg = document.querySelector('#pwdImg') as HTMLImageElement;
  const loginForm = document.querySelector('#loginForm') as HTMLFormElement;

  username.addEventListener('input', function() {
    removeError(username, nameMessage);
  });

  password.addEventListener('input', function() {
    removeError(password, pwdMessage);
  });

  pwdImg.addEventListener('click', function() {
    imgChange(pwdImg, password);
  });

  loginForm.addEventListener('submit', function(event) {
    if (!validateUsername(username, nameMessage)) {
      event.preventDefault();
    }
  });
};
