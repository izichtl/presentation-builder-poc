"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const google_handler_1 = __importDefault(require("./router/google-handler"));
const data_reciver_1 = __importDefault(require("./router/data-reciver"));
const base_router_1 = __importDefault(require("./router/base-router"));
const pdf_invoice_1 = __importDefault(require("./router/pdf-invoice"));
const whats_reciver_1 = __importDefault(require("./router/whats-reciver"));
const app = (0, express_1.default)();
require("dotenv").config();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// router
app.use('/', google_handler_1.default);
app.use('/data-reciver', data_reciver_1.default);
app.use('/pdf', pdf_invoice_1.default);
app.use('/', whats_reciver_1.default);
// app.post("/webhook",(req,res)=>{
//   let mode=req.query["hub.mode"];
//   let challange=req.query["hub.challenge"];
//   let token=req.query["hub.verify_token"];
//   console.log('@@@@@@@@@@')
//    if(mode && token){
//        if(mode==="subscribe" && token==='ivan'){
//            res.status(200).send(challange);
//        }else{
//            res.status(403);
//        }
//    }
// });
// to test only
app.use('/test', base_router_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=index.js.map