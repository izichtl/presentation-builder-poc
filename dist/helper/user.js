"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromEmailInSupabase = exports.updateUserToken = exports.getUserFromEmail = exports.getUserFromToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const redis_1 = require("../database/redis");
const supabase_1 = require("../database/supabase");
function getUserFromToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return jwt.decode(token.replace('Bearer ', ''), { complete: true });
    });
}
exports.getUserFromToken = getUserFromToken;
function getUserFromEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const redisClient = yield redis_1.redisPool.acquire();
        const userExist = yield redisClient.get(email);
        redis_1.redisPool.release(redisClient);
        return userExist;
    });
}
exports.getUserFromEmail = getUserFromEmail;
function updateUserToken(email, access_token, refresh_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const redisClient = yield redis_1.redisPool.acquire();
        const userExist = yield redisClient.get(email);
        const userJSON = JSON.parse(userExist);
        userJSON.access_token = access_token;
        if (refresh_token !== undefined) {
            userJSON.refresh_token = refresh_token;
        }
        const toStoreUpdate = JSON.stringify(userJSON);
        redisClient.set(email, toStoreUpdate, (err, result) => {
            if (err) {
                console.error('Erro ao definir chave:', err);
            }
            else {
                console.log('Token Atualizado', result);
            }
        });
        redis_1.redisPool.release(redisClient);
    });
}
exports.updateUserToken = updateUserToken;
function getUserFromEmailInSupabase(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const select = yield supabase_1.supabase
            .from('whatsapp_presentation')
            .select().eq('userEmail', email)
            .order('created_at', { ascending: false });
        if (select.data !== null)
            return select.data[0];
        if (select.data === null)
            return null;
    });
}
exports.getUserFromEmailInSupabase = getUserFromEmailInSupabase;
//# sourceMappingURL=user.js.map