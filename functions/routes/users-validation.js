function isEmpty(string) {
  return string.trim() === "";
}
function isEmail(email) {
  //eslint-disable-next-line
  const mailTemplateExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(mailTemplateExp);
}

exports.validateSignUp = function({
  email,
  password,
  confirmPassword,
  handle
}) {
  let validationError = "";
  if (
    isEmpty(email) ||
    isEmpty(password) ||
    isEmpty(confirmPassword) ||
    isEmpty(handle)
  ) {
    validationError = "All fields are required";
  } else if (!isEmail(email)) {
    validationError = "Email is not properly formated";
  } else if (password !== confirmPassword) {
    validationError = "Passwords must be the same";
  }
  return validationError;
};

exports.validateLogIn = function({ email, password }) {
  let validationError = "";
  if (isEmpty(email) || isEmpty(password)) {
    validationError = "All fields are required";
  } else if (!isEmail(email)) {
    validationError = "Email is not properly formated";
  }
  return validationError;
};
