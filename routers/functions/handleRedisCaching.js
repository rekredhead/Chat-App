const redis = require('redis');
const redisClient = redis.createClient();

const cachePasswordResettingData = async(username, password, verificationCode) => {
   await redisClient.connect();

   await redisClient.hSet(username, 'password', password);
   await redisClient.hSet(username, 'verificationCode', verificationCode);
   await redisClient.expire(username, 300); // Cache expires in 5 minutes
   
   await redisClient.disconnect();
}

const getPasswordResettingDataFromCache = async(username) => {
   await redisClient.connect();

   const data = await redisClient.hGetAll(username);

   await redisClient.disconnect();
   return data;
}

const deleteDataFromCache = async(username) => {
   await redisClient.connect();

   await redisClient.hDel(username, 'password');
   await redisClient.hDel(username, 'verificationCode');

   await redisClient.disconnect();
}

module.exports = { cachePasswordResettingData, getPasswordResettingDataFromCache, deleteDataFromCache };