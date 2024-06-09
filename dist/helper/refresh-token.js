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
exports.verifyGoogleToken = exports.obterTokenDeAtualizacao = void 0;
const axios_1 = __importDefault(require("axios"));
const user_1 = require("./user");
require("dotenv").config();
function obterTokenDeAtualizacao(data, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post('https://oauth2.googleapis.com/token', {
                client_id: process.env.APP_CLIENT_ID,
                client_secret: process.env.APP_CLIENT_SECRET,
                refresh_token: data.refresh_token,
                grant_type: 'refresh_token'
            });
            const accessToken = response.data.access_token;
            yield (0, user_1.updateUserToken)(email, accessToken, undefined);
            return accessToken;
        }
        catch (error) {
            console.error('Erro ao obter token de atualização:', error);
            throw error;
        }
    });
}
exports.obterTokenDeAtualizacao = obterTokenDeAtualizacao;
function verifyGoogleToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`;
        try {
            yield axios_1.default.get(url);
            return true;
        }
        catch (error) {
            // @ts-ignore
            if (error.response.data.error === 'invalid_token') {
                return false;
            }
            return false;
        }
    });
}
exports.verifyGoogleToken = verifyGoogleToken;
//# sourceMappingURL=refresh-token.js.map