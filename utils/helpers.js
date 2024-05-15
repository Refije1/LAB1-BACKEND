const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateRandomString = () => {
  return crypto.randomBytes(20).toString("hex");
};

const hashString = async (useValue) => {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(useValue, salt);
  return hashedpassword;
};

const compareString = async (userPassword, password) => {
  const isMatch = await bcrypt.compare(userPassword, password);
  return isMatch;
};

const createJWT = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = { generateRandomString, hashString, compareString, createJWT };
