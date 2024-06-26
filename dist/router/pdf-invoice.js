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
const pdf_builder_1 = require("../helper/pdf-builder");
const user_1 = require("../helper/user");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.get('/invoice', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.email === undefined) {
        return res.send('Please send user email as query string');
    }
    else {
        const email = req.query.email;
        const user = yield (0, user_1.getUserFromEmail)(email);
        const jsonUser = JSON.parse(user);
        const htmlTitle = jsonUser.title;
        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline;filename=${jsonUser.title}.pdf`
            // to force download on user browser
            // 'Content-Disposition': 'attachment;filename=pdf.pdf'
        });
        (0, pdf_builder_1.buildPDF)(jsonUser, (data) => stream.write(data), () => stream.end());
    }
}));
exports.default = router;
//# sourceMappingURL=pdf-invoice.js.map