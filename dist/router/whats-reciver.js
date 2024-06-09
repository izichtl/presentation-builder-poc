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
const express_1 = __importDefault(require("express"));
const whats_sender_1 = require("../helper/whats-sender");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ response: true });
}));
// router.get('/webhook', (req, res) => {
//   res.send(req.query["hub.challenge"]).status(200).end()
// });
router.post('/webhook1', (req, res) => {
    let msg = '';
    let betDatas = {};
    if (req.body.entry[0] !== undefined) {
        const entry = req.body.entry[0].changes;
        if (entry[0] !== undefined) {
            const menssage = entry[0].value.messages;
            if (menssage[0] !== undefined) {
                msg = menssage[0].text.body;
            }
        }
    }
    const payload = req.body; // O corpo da solicitação contém os dados da webhook
    console.log(payload);
    // const defaultMSG = `Bem vindo ao Cambista Digital da ValSports: 
    //   1 - Realizar uma aposta;
    //   2 - Cancelar;
    //   `
    // const goPayment = `Aguarde um momento, enviaremos o qrcode para pagamento`
    // const recivedmsg = value.messages[0].text.body
    const recivedmsg = msg;
    if (recivedmsg === '1') {
        (0, whats_sender_1.whatsAppSenderMessage)("5521982608223", "Envie o código da aposta", "HBgNNTUyMTk4MjYwODIyMxUCABIYEjBERUQxNzk3MDFEODM4N0QzMQA=");
        res.status(200).send('Webhook recebida com sucesso!');
    }
    res.status(200).send('Webhook recebida com sucesso!');
});
exports.default = router;
//# sourceMappingURL=whats-reciver.js.map