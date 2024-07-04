"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAuth = void 0;
require("dotenv").config();
const hasAuth = (headerToken) => {
    const api = process.env.API_AUTH;
    console.log(api, 'api');
    console.log(headerToken, 'headerToken');
    return headerToken !== api;
};
exports.hasAuth = hasAuth;
//# sourceMappingURL=auth.js.map