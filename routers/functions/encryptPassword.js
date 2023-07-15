const bcrypt = require('bcrypt');

const saltRounds = 10;
const encryptPassword = async(password) => await bcrypt.hash(password, saltRounds);

module.exports = encryptPassword;