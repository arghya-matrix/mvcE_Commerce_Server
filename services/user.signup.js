const db = require("../models/index");

async function signUp({
  firstName,
  lastName,
  EmailAddress,
  userName,
  password,
  imageUrl,
}) {
  const user = await db.User.create({
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    EmailAddress: EmailAddress,
    password: password,
    imageUrl: imageUrl
  });
  return user;
}

module.exports = {
  signUp,
};
