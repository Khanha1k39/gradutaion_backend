const { promisify } = require("util");
const redis = require("redis");
const { reservationInventory } = require("../models/repository/inventory.repo");
const redisClient = redis.createClient();
const pexprie = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2025__${productId}`;
  const retyTimes = 10;
  const exprieTime = 3000;
  for (let i = 0; i < retyTimes; i++) {
    const result = await setnxAsync(key, exprieTime);
    if (result == 1) {
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReversation.modifiedCount0) {
        await pexprie(key, exprieTime);
        return key;
      }

      return null;
    } else {
      await Promise((res) => {
        setTimeout(res, 50);
      });
    }
  }
};
const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redis);
  return await delAsyncKey(keyLock);
};
module.exports = {
  acquireLock,
  releaseLock,
};
