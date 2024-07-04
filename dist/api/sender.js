"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChat = exports.pdfBuilderAPI = void 0;
// @ts-nocheck
const axios_1 = __importDefault(require("axios"));
function pdfBuilderAPI(email) {
    var config = {
        method: 'get',
        url: `${process.env.APP_REDIRECT_URL}/pdf/botmaker?email=${email}`,
        headers: {
            'Authorization': `Bearer ${process.env.WA_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };
    console.log('retorna');
    return (0, axios_1.default)(config);
}
exports.pdfBuilderAPI = pdfBuilderAPI;
function updateChat(email, id, channelId, contactId) {
    const url = 'https://api.botmaker.com/v2.0/chats-actions/trigger-intent';
    console.log(process.env.BOTMAKER_API_AUTH);
    const data = {
        "chat": {
            "channelId": channelId,
            "contactId": contactId
        },
        "intentIdOrName": "arco-hsr9i10buu@b.m-1720063141260",
        "variables": {
            "presentationId": id,
            "userEmail": email
        },
        "tags": {
            "tagName": true,
            "anotherTag": false
        },
        "webhookPayload": "string"
    };
    const headers = {
        'Access-token': `${process.env.BOTMAKER_API_AUTH}`,
        'Content-Type': 'application/json'
    };
    return axios_1.default.post(url, data, { headers })
        .then(response => {
        console.log('Response:', response.data);
        // Handle the response data
    })
        .catch(error => {
        console.error('Error:', error);
        // Handle error
    });
}
exports.updateChat = updateChat;
//# sourceMappingURL=sender.js.map