const bcrypt = require('bcrypt');
const encryptPassword = require('../encryptPassword');

describe('encryptPassword', () => {
   const password = 'testpassword';

   it('should encrypt the password successfully', async() => {
      const encryptedPassword = await encryptPassword(password);

      const doesPasswordMatch = await bcrypt.compare(password, encryptedPassword);
      expect( doesPasswordMatch ).toEqual(true);
   });
});