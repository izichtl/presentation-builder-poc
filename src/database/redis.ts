// @ts-nocheck
import { createPool, Pool } from 'generic-pool';
import Redis from 'ioredis';
require("dotenv").config()


const redisPool: Pool<Redis.Redis> = createPool({
  create: async () => {
    const client = new Redis(process.env.REDIS_URL, { password: process.env.REDIS_SECRET});
    return client;
  },
  destroy: (client) => client.quit(),
  validate: (client) => {
    return client.status === 'ready';
  }
}, {
  max: 10,
  min: 2, 
  testOnBorrow: true 
});

export { redisPool };

// redisClient.keys('*', (err, keys) => {
//   if (err) {
//       console.error("Error retrieving keys:", err);
//       return;
//   }
//   console.log(JSON.stringify(keys, null, 2))
//   redisClient.quit();
// });