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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLayer = exports.createIntroduction = void 0;
// @ts-nocheck 
const refresh_token_1 = require("./refresh-token");
const unit_converts_1 = require("./unit-converts");
const user_1 = require("./user");
const uuid_1 = require("uuid");
const g_slides_elements_1 = require("./g-slides-elements");
const slides_api_functions_1 = require("./google-module/slides-api-functions");
require("dotenv").config();
const createIntroduction = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    const imageSlide_Background = 'https://lh3.googleusercontent.com/d/1VF5pK-LZ8r9WJGrqPGT0MTtPxirxvS8u';
    const imageSlide_Crescer = 'https://lh3.googleusercontent.com/d/184BJy5NdcN0G2c31oqJkLE6tEkgemBjY';
    const imageSlide_Sicred = 'https://lh3.googleusercontent.com/d/18I_-9odeS9u95BojYLx-di-khJni73MM';
    const larguratotal = (25.4);
    // const alturatotal = (14.29)  
    let user_token = '';
    const user_email = email;
    // const user_name = name  
    const user = yield (0, user_1.getUserFromEmail)(user_email);
    const jsonUser = JSON.parse(user);
    user_token = jsonUser.access_token;
    const isValid = yield (0, refresh_token_1.verifyGoogleToken)(jsonUser.access_token);
    if (!isValid) {
        const ntoken = yield (0, refresh_token_1.obterTokenDeAtualizacao)(jsonUser, user_email);
        user_token = ntoken;
    }
    // creating id of objets
    const slide_01_id = (0, uuid_1.v4)();
    const title_slide_01_id = (0, uuid_1.v4)();
    const subtitle_slide_01_id = (0, uuid_1.v4)();
    const subinfo_slide_01_id = (0, uuid_1.v4)();
    // delete default slide
    const requests = [
        {
            deleteObject: {
                objectId: 'p'
            },
        }
    ];
    // adding the slide to request
    requests.push({
        // @ts-ignore
        createSlide: {
            objectId: slide_01_id
        }
    });
    // adding background
    const updatedWithBackGround = (0, g_slides_elements_1.pushImageInRequest)('background_wave', slide_01_id, imageSlide_Background, (0, unit_converts_1.cmToPoints)(0), (0, unit_converts_1.cmToPoints)(8.85), (0, unit_converts_1.cmToPoints)(larguratotal), (0, unit_converts_1.cmToPoints)(5.14), requests);
    const updatedWithSicredGround = (0, g_slides_elements_1.pushImageInRequest)('sicred_logo', slide_01_id, imageSlide_Sicred, (0, unit_converts_1.cmToPoints)(17.4), (0, unit_converts_1.cmToPoints)(12), (0, unit_converts_1.cmToPoints)(7.19), (0, unit_converts_1.cmToPoints)(2.12), updatedWithBackGround);
    const updatedWithCrescerGround = (0, g_slides_elements_1.pushImageInRequest)('crescer_logo', slide_01_id, imageSlide_Crescer, (0, unit_converts_1.cmToPoints)((larguratotal / 2) - (10.28 / 2)), (0, unit_converts_1.cmToPoints)(0.1), (0, unit_converts_1.cmToPoints)(10.28), (0, unit_converts_1.cmToPoints)(3.76), updatedWithSicredGround);
    const updateWithTitle = (0, g_slides_elements_1.pushTextInRequest)(title_slide_01_id, slide_01_id, `Briefing - ${data.mood}`, (0, unit_converts_1.cmToPoints)(((larguratotal / 2) - (22 / 2))), (0, unit_converts_1.cmToPoints)(3.5), (0, unit_converts_1.cmToPoints)(22), (0, unit_converts_1.cmToPoints)(2.30), 'Exo 2', 50, true, false, {
        red: 0.6,
        green: 0.6,
        blue: 0.6,
    }, updatedWithCrescerGround);
    const updateWithSubTitle = (0, g_slides_elements_1.pushTextInRequest)(subtitle_slide_01_id, slide_01_id, 'Reconstrução formações do Crescer', (0, unit_converts_1.cmToPoints)(((larguratotal / 2) - (16.32 / 2))), (0, unit_converts_1.cmToPoints)(6), (0, unit_converts_1.cmToPoints)(16.32), (0, unit_converts_1.cmToPoints)(1.30), 'Exo 2', 27, false, true, {
        red: 0.6,
        green: 0.6,
        blue: 0.6,
    }, updateWithTitle);
    const updateWithSubinfo = (0, g_slides_elements_1.pushTextInRequest)(subinfo_slide_01_id, slide_01_id, `${data.name} -2024`, (0, unit_converts_1.cmToPoints)(1.91), (0, unit_converts_1.cmToPoints)(9), (0, unit_converts_1.cmToPoints)(6.51), (0, unit_converts_1.cmToPoints)(1), 'Exo 2', 16, false, false, {
        red: 0.6,
        green: 0.6,
        blue: 0.6,
    }, updateWithSubTitle);
    const presentation = yield (0, slides_api_functions_1.createPresentation)(user_token, 'temp');
    console.log('CREATED');
    const created_presentation_id = presentation.data.presentationId;
    yield (0, slides_api_functions_1.createSlide)(user_token, created_presentation_id, updateWithSubinfo);
    console.log('UPDATED');
    const coopThumbNailsArray = yield (0, slides_api_functions_1.getImageLinks)(user_token, created_presentation_id);
    console.log(coopThumbNailsArray);
    yield (0, slides_api_functions_1.deletePresentation)(user_token, created_presentation_id);
    console.log('DELETED');
    return coopThumbNailsArray[0];
});
exports.createIntroduction = createIntroduction;
const authLayer = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let user_token = '';
    const user_email = email;
    const user = yield (0, user_1.getUserFromEmail)(user_email);
    const jsonUser = JSON.parse(user);
    console.log(jsonUser);
    user_token = jsonUser.access_token;
    const isValid = yield (0, refresh_token_1.verifyGoogleToken)(jsonUser.access_token);
    if (!isValid) {
        const ntoken = yield (0, refresh_token_1.obterTokenDeAtualizacao)(jsonUser, user_email);
        user_token = ntoken;
    }
    return user_token;
});
exports.authLayer = authLayer;
//# sourceMappingURL=introduction-builder.js.map