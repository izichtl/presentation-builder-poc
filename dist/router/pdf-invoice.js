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
const drive_api_functions_1 = require("../helper/google-module/drive-api-functions");
const introduction_builder_1 = require("../helper/introduction-builder");
const drive_api_functions_2 = require("../helper/google-module/drive-api-functions");
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
        // const htmlTitle = jsonUser.title;
        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline;filename=${jsonUser.title}.pdf`
            // to force download on user browser
            // 'Content-Disposition': 'attachment;filename=pdf.pdf'
        });
        (0, pdf_builder_1.buildPDF)(jsonUser, (data) => stream.write(data), () => stream.end());
    }
}));
router.get('/botmaker', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('----------------------------');
    console.log('----------------------------');
    console.log('----------------------------');
    console.log('----------------------------');
    console.log('----------------------------');
    console.log('----------------------------');
    console.log('----------------------------');
    if (req.query.email === undefined) {
        return res.send('Please send user email as query string');
    }
    else {
        const email = req.query.email;
        const user = yield (0, user_1.getUserFromEmailInSupabase)(email);
        yield (0, pdf_builder_1.buildPDFBotMaker)(user);
        res.status(200).send({
            success: true
        });
    }
}));
router.get('/apresentacao', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.fileId;
    const email = req.query.email;
    const token = yield (0, introduction_builder_1.authLayer)(email);
    const fileInfo = yield (0, drive_api_functions_1.getFile)(token, id);
    // Get file name and MIME type
    const fileName = fileInfo.data.name;
    const mimeType = fileInfo.data.mimeType;
    // Set headers for file download
    res.set('Content-Type', mimeType);
    res.set('Content-Disposition', `inline; filename="${fileName}"`);
    // Get file stream from Google Drive
    const fileStream = yield (0, drive_api_functions_2.getFileStream)(token, id);
    fileStream.data.pipe(res);
}));
exports.default = router;
// function gunzipToBuffer(gunzipInstance: any) {
//   return new Promise((resolve, reject) => {
//     const chunks: any = [];
//     // Evento 'data' para capturar cada pedaço de dados descomprimidos
//     gunzipInstance.on('data', (data: any) => {
//       chunks.push(data); // Adiciona o chunk ao array de chunks
//     });
//     // Evento 'end' para saber quando a descompressão terminou
//     gunzipInstance.on('end', () => {
//       // Concatena todos os chunks em um único Buffer
//       const buffer = Buffer.concat(chunks);
//       resolve(buffer);
//     });
//     // Evento 'error' para lidar com erros de descompressão
//     gunzipInstance.on('error', (err: any) => {
//       reject(err);
//     });
//   });
// }
//     stream.write(await gunzipToBuffer(fileStream.data))
//# sourceMappingURL=pdf-invoice.js.map