"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisPool = void 0;
// @ts-nocheck
const generic_pool_1 = require("generic-pool");
const ioredis_1 = __importDefault(require("ioredis"));
require("dotenv").config();
const redisPool = (0, generic_pool_1.createPool)({
    create: () => __awaiter(void 0, void 0, void 0, function* () {
        const client = new ioredis_1.default(process.env.REDIS_URL, { password: process.env.REDIS_SECRET });
        return client;
    }),
    destroy: (client) => client.quit(),
    validate: (client) => {
        return client.status === 'ready';
    }
}, {
    max: 10,
    min: 2,
    testOnBorrow: true
});
exports.redisPool = redisPool;
// redisClient.keys('*', (err, keys) => {
//   if (err) {
//       console.error("Error retrieving keys:", err);
//       return;
//   }
//   console.log(JSON.stringify(keys, null, 2))
//   redisClient.quit();
// });
//# sourceMappingURL=redis.js.map