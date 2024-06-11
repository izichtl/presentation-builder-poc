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
const datetime_1 = require("../helper/datetime");
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
router.post('/whatsapp/metrics', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let redisClient = null;
    try {
        redisClient = yield redis_1.redisPool.acquire();
        const dataFromForm = req.body;
        const userExist = yield redisClient.get(dataFromForm.user_id);
        if (userExist === null || userExist === undefined) {
            const userModel = {
                id: dataFromForm.user_id,
                data_array: [],
                created_at: (0, datetime_1.formatDateTime)(new Date())
            };
            delete dataFromForm.user_id;
            userModel.data_array.push(dataFromForm);
            redisClient.set(userModel.id, JSON.stringify(userModel));
        }
        else {
            const jsonUserExist = JSON.parse(userExist);
            delete dataFromForm.user_id;
            jsonUserExist.data_array.push(dataFromForm);
            redisClient.set(jsonUserExist.id, JSON.stringify(jsonUserExist));
        }
    }
    catch (error) {
        console.error('Erro ao usar a conexão Redis:', error);
    }
    finally {
        if (redisClient) {
            yield redis_1.redisPool.release(redisClient);
        }
        res.status(200).send({
            success: true
        });
    }
}));
router.delete('/whatsapp/metrics', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let redisClient = null;
    let response = {
        success: true,
        msg: 'deleted',
        status: 200
    };
    try {
        redisClient = yield redis_1.redisPool.acquire();
        const dataFromForm = req.body;
        const userExist = yield redisClient.get(dataFromForm.user_id);
        if (userExist === null || userExist === undefined) {
            response.success = false;
            response.status = 400;
            response.msg = 'user_not_found';
        }
        else {
            redisClient.del(dataFromForm.user_id);
        }
    }
    catch (error) {
        console.error('Erro ao usar a conexão Redis:', error);
    }
    finally {
        if (redisClient) {
            yield redis_1.redisPool.release(redisClient);
        }
        res.status(response.status).send({
            success: response.success,
            msg: response.msg,
        });
    }
}));
router.get('/whatsapp/metrics', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let redisClient = null;
    let response = {
        success: false,
        data: 'user_not_found',
        status: 400
    };
    try {
        redisClient = yield redis_1.redisPool.acquire();
        const dataFromForm = req.body;
        const userExist = yield redisClient.get(dataFromForm.user_id);
        if (userExist !== null || userExist !== undefined) {
            response.success = true;
            response.status = 200;
            response.data = JSON.parse(userExist);
        }
    }
    catch (error) {
        console.error('Erro ao usar a conexão Redis:', error);
    }
    finally {
        if (redisClient) {
            yield redis_1.redisPool.release(redisClient);
        }
        res.status(response.status).send({
            success: response.success,
            data: response.data,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=data-reciver.js.map