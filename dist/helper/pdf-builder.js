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
exports.buildPDFBotMaker = exports.buildPDF = void 0;
// @ts-nocheck
const pdfkit_1 = __importDefault(require("pdfkit"));
const g_slides_builder_1 = require("./g-slides-builder");
const drive_api_functions_1 = require("./google-module/drive-api-functions");
const introduction_builder_1 = require("./introduction-builder");
const sender_1 = require("../api/sender");
const buildPDF = (user, dataCallBack, endCallBack) => __awaiter(void 0, void 0, void 0, function* () {
    // 1 inch = 72 points
    const widthInPoints = 25.4 * 72 / 2.54;
    const heightInPoints = 14.9 * 72 / 2.54;
    // creat the first page with correct size
    const pdf = new pdfkit_1.default({ size: [widthInPoints, heightInPoints], margin: 0 });
    // update title of presentation
    pdf.info.Title = user.title;
    pdf.on('data', dataCallBack);
    pdf.on('end', endCallBack);
    yield (0, g_slides_builder_1.pdfSlidesBuilder)(user, pdf, {
        width: widthInPoints,
        height: heightInPoints
    }, undefined);
    pdf.end();
});
exports.buildPDF = buildPDF;
const buildPDFBotMaker = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // 1 inch = 72 points
    const widthInPoints = 25.4 * 72 / 2.54;
    const heightInPoints = 14.9 * 72 / 2.54;
    const pdf = new pdfkit_1.default({ size: [widthInPoints, heightInPoints], margin: 0 });
    pdf.info.Title = user.presentationData.title;
    const token = yield (0, introduction_builder_1.authLayer)(user.userEmail);
    const buildedPDF = yield (0, g_slides_builder_1.pdfPresentationBuilderBySlides)(JSON.parse(JSON.stringify(user)), pdf, {
        width: widthInPoints,
        height: heightInPoints
    }, true);
    buildedPDF.end();
    // console.log('pos-end')
    const createdId = yield (0, drive_api_functions_1.uploadPDF)(token, buildedPDF);
    yield (0, drive_api_functions_1.patchToPublicFile)(token, createdId);
    const createdPDFLink = yield (0, drive_api_functions_1.getPublicLink)(token, createdId);
    console.log(user.userEmail, 'user.userEmail');
    console.log(createdId, 'createdId');
    console.log(user.channelId, 'user.channelId');
    console.log(user.userNumber, 'user.userNumber');
    yield (0, sender_1.updateChat)(user.userEmail, createdId, user.channelId, user.userNumber);
    console.log(createdId, 'id');
    console.log(createdPDFLink.data.webViewLink, 'link');
    // console.log(chat)
});
exports.buildPDFBotMaker = buildPDFBotMaker;
//# sourceMappingURL=pdf-builder.js.map