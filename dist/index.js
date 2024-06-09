"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const google_handler_ts_1 = __importDefault(require("./router/google-handler.ts"));
const data_reciver_ts_1 = __importDefault(require("./router/data-reciver.ts"));
const base_router_ts_1 = __importDefault(require("./router/base-router.ts"));
const app = (0, express_1.default)();
require("dotenv").config();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// router
app.use('/', google_handler_ts_1.default);
app.use('/data-reciver', data_reciver_ts_1.default);
// to test only
app.use('/test', base_router_ts_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=index.js.map