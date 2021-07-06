import { imgChange, removeError } from './login-common';
import './style.scss';

window.onload = function() {
  const oldPassword = document.querySelector('#oldPassword') as HTMLInputElement;
  const newPassword = document.querySelector('#newPassword') as HTMLInputElement;
  const oldMessage = document.querySelector('#oldMessage') as HTMLElement;
  const newMessage = document.querySelector('#newMessage') as HTMLElement;
  const oldImg = document.querySelector('#oldImg') as HTMLImageElement;
  const newImg = document.querySelector('#newImg') as HTMLImageElement;

  oldPassword.addEventListener('input', function() {
    removeError(oldPassword, oldMessage);
  });

  newPassword.addEventListener('input', function() {
    removeError(newPassword, newMessage);
  });

  oldImg.addEventListener('click', function() {
    imgChange(oldImg, oldPassword);
  });

  newImg.addEventListener('click', function() {
    imgChange(newImg, newPassword);
  });
};

