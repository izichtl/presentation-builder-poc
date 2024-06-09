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
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const redis_1 = require("../database/redis");
const router = express_1.default.Router();
router.use(express_1.default.json());
const upload = (0, multer_1.default)();
router.post('/', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let email = '';
    const redisClient = yield redis_1.redisPool.acquire();
    const dataFromForm = req.body;
    if (dataFromForm.gmail_email !== undefined) {
        email = dataFromForm.gmail_email;
    }
    else {
        email = dataFromForm.generic_email;
    }
    const userData = {
        id: dataFromForm.submission_id,
        email: email,
        title: dataFromForm.presetation_title,
        style: dataFromForm.presentation_style,
        thema_list: dataFromForm.presentation_thema_list,
        refresh_token: '',
        access_token: ''
    };
    const toStore = JSON.stringify(userData);
    // verifica se o user existe no redis
    const userExist = yield redisClient.get(email);
    if (userExist === null || userExist === undefined) {
        redisClient.set(email, toStore);
    }
    else {
        // user registrado ou autorizado
        const userJSON = JSON.parse(userExist);
        if (userJSON.refresh_token === '') {
            // verifica se o user tem refresh_token
            // salvo user e mando para o oaut
            // preciso enviar ele para oauth
            redisClient.set(email, toStore);
        }
        else {
            // persiste o refresh_token
            // atualiza o dados do usuario
            const refresh_token = userJSON.refresh_token;
            userData.refresh_token = refresh_token;
            const toStoreUpdate = JSON.stringify(userData);
            redisClient.set(email, toStoreUpdate);
        }
    }
    // fecha a conexão com redis
    redis_1.redisPool.release(redisClient);
    if (dataFromForm.gmail_email !== undefined) {
        res.redirect('/oauth');
    }
    else {
        res.redirect(`/pdf/invoice?email=${email}`);
    }
}));
exports.default = router;
//# sourceMappingURL=data-reciver.js.map