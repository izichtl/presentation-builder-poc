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
exports.whatsAppSenderMessage = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WA_TOKEN}`
    }
};
const whatsAppSenderMessage = (number, message, wmaid) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://graph.facebook.com/v19.0/${wmaid}/messages`;
    if (wmaid) {
        axios_1.default.post(url, {
            messaging_product: 'whatsapp',
            context: {
                message_id: wmaid
            },
            to: number,
            type: "text",
            text: {
                "body": message,
            }
        }, axiosConfig)
            .then(function (response) {
            return true;
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    else {
        // axios.post(`https://graph.facebook.com/v14.0/${wmaid}/messages`, {
        //     messaging_product: 'whatsapp',
        //     to: number,
        //     type: "text",
        //     text: { 
        //         "body": message, 
        //     }
        // }, axiosConfig)
        // .then(function (response: any) {
        //     console.log(response)
        //     return true
        // })
        // .catch(function (error) {
        //     console.log(error)
        // });
    }
});
exports.whatsAppSenderMessage = whatsAppSenderMessage;
//# sourceMappingURL=whats-sender.js.map