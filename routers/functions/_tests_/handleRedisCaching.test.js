const redis = require('redis');
const redisClient = redis.createClient();
const { cachePasswordResettingData, getPasswordResettingDataFromCache, deleteDataFromCache } = require('../handleRedisCaching');

redisClient.connect();

describe('Cache Password Reset Data in Redis', () => {
   const testPasswordResetData = {
      username: 'testuser',
      password: 'testpassword',
      verificationCode: 'testVerificationCode'
   };
   
   afterAll((done) => {
      redisClient.disconnect(done());
   });

   it('should cache password reset data successfully', async() => {
      await cachePasswordResettingData(
         testPasswordResetData.username,
         testPasswordResetData.password,
         testPasswordResetData.verificationCode);

      const cachedPasswordResettingData = await getPasswordResettingDataFromCache(testPasswordResetData.username);

      expect(cachedPasswordResettingData.password).toBe('testpassword');
      expect(cachedPasswordResettingData.verificationCode).toBe('testVerificationCode');
   });

   it('should delete password reset data successfully', async() => {
      await cachePasswordResettingData(
         testPasswordResetData.username,
         testPasswordResetData.password,
         testPasswordResetData.verificationCode);
      
      await deleteDataFromCache(testPasswordResetData.username);

      const cachedPasswordResettingData = await getPasswordResettingDataFromCache(testPasswordResetData.username);

      const isUsernameInCachedData = Object.entries(cachedPasswordResettingData).length > 0;
      expect(isUsernameInCachedData).toBe(false);
   });
});