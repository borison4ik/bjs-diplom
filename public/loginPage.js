'use strict';

const userForm = new UserForm();

const callback = (response, setMessage) =>
  !response.success ? setMessage.call(userForm, response.error) : location.reload();

userForm.registerFormCallback = (data) =>
  ApiConnector.register(data, (response) => callback(response, userForm.setRegisterErrorMessage));
userForm.loginFormCallback = (data) =>
  ApiConnector.login(data, (response) => callback(response, userForm.setLoginErrorMessage));
