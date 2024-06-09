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
// @ts-nocheck 
const express_1 = __importDefault(require("express"));
const googleapis_1 = require("googleapis");
const user_1 = require("../helper/user");
const g_slides_builder_1 = require("../helper/g-slides-builder");
const refresh_token_1 = require("../helper/refresh-token");
require("dotenv").config();
function createPresentation(token, title) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = googleapis_1.google.slides({
            version: 'v1',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        service.context;
        return service.presentations.create({
            title,
        });
    });
}
function createSlide(token, presentationId, requests) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = googleapis_1.google.slides({
            version: 'v1',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return service.presentations.batchUpdate({
            presentationId,
            resource: { requests },
        });
    });
}
const router = express_1.default.Router();
router.use(express_1.default.json());
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.APP_CLIENT_ID, process.env.APP_CLIENT_SECRET, process.env.APP_REDIRECT_URL);
const scopes = [
    'https://www.googleapis.com/auth/presentations',
    'https://www.googleapis.com/auth/userinfo.email'
];
router.get('/oauth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send('Express Typescript on Vercel');
    if (req.query.code === undefined) {
    }
    else {
        const code = req.query.code;
        const { tokens } = yield oauth2Client.getToken(code);
        const user = yield (0, user_1.getUserFromToken)(tokens.id_token);
        const access_token = tokens.access_token;
        const user_email = user.payload.email;
        const refresh_token = tokens.refresh_token;
        yield (0, user_1.updateUserToken)(user_email, access_token, refresh_token);
        res.redirect(307, `/create-presentation?email=${user_email}`);
    }
}));
router.get('/create-presentation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
    let user_token = '';
    const user_email = req.query.email;
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log(user_email);
    const user = yield (0, user_1.getUserFromEmail)(user_email);
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@1');
    const jsonUser = JSON.parse(user);
    console.log(jsonUser);
    user_token = jsonUser.access_token;
    const requestObject = yield (0, g_slides_builder_1.slidesRequestBuilder)(jsonUser);
    const isValid = yield (0, refresh_token_1.verifyGoogleToken)(jsonUser.access_token);
    if (!isValid) {
        const ntoken = yield (0, refresh_token_1.obterTokenDeAtualizacao)(jsonUser, user_email);
        user_token = ntoken;
    }
    const presentation = yield createPresentation(user_token, requestObject.title);
    const created_presentation_id = presentation.data.presentationId;
    yield createSlide(user_token, created_presentation_id, requestObject.requests);
    console.log(created_presentation_id);
    const urlslide = `https://docs.google.com/presentation/d/${created_presentation_id}/edit#slide=id.p`;
    res.redirect(urlslide);
    // res.send({ response: true})
}));
exports.default = router;
//# sourceMappingURL=google-handler.js.map