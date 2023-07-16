const redis = require('redis');
const redisClient = redis.createClient();

redisClient.connect();

const cachePasswordResettingData = async(username, password, verificationCode) => {
   await redisClient.hSet(username, 'password', password);
   await redisClient.hSet(username, 'verificationCode', verificationCode);

   await redisClient.expire(username, 300); // Cache expires in 5 minutes
}

const getPasswordResettingDataFromCache = async(username) => {
   const data = await redisClient.hGetAll(username);
   return data;
}

module.exports = { cachePasswordResettingData, getPasswordResettingDataFromCache };