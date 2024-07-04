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
const bot_maker_1 = __importDefault(require("./router/bot-maker"));
const path_1 = __importDefault(require("path"));
// import fs from 'fs'
const app = (0, express_1.default)();
require("dotenv").config();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// Define o caminho para o diretório 'public'
const publicDirPath = path_1.default.join(__dirname, 'public');
// Configura o middleware para servir arquivos estáticos
app.use(express_1.default.static(publicDirPath));
// app.use(express.static(path.join(__dirname, 'public')));
// console.log(fs.createReadStream(publicDirPath + '/images/intro_a.png'))
// router
app.use('/', google_handler_1.default);
app.use('/data-reciver', data_reciver_1.default);
app.use('/pdf', pdf_invoice_1.default);
app.use('/botmaker', bot_maker_1.default);
// to test only
app.use('/test', base_router_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=index.js.map