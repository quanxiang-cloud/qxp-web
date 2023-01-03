import { imgChange, removeError, validateUsername } from './login-common';
import './style.scss';

window.onload = function() {
};

const username = document.querySelector('#username1') as HTMLInputElement;
const password = document.querySelector('#password1') as HTMLInputElement;
const nameMessage = document.querySelector('#nameMessage1') as HTMLElement;
const pwdMessage = document.querySelector('#pwdMessage1') as HTMLElement;
const pwdImg = document.querySelector('#pwdImg1') as HTMLImageElement;
const loginForm = document.querySelector('#loginForm1') as HTMLFormElement;

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
