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
const uuid_1 = require("uuid");
const g_slides_elements_1 = require("../helper/g-slides-elements");
const unit_converts_1 = require("../helper/unit-converts");
require("dotenv").config();
const SIZE = {
    UNSPECIFIED: 'THUMBNAIL_SIZE_UNSPECIFIED',
    LARGE: 'LARGE',
    MEDIUM: 'MEDIUM',
    SMALL: 'SMALL',
};
const IMAGE_SIZE = SIZE.LARGE;
const MAX_SLIDE_COUNT = 10;
const getSlideObjects = (token, presentationId) => __awaiter(void 0, void 0, void 0, function* () {
    const service = googleapis_1.google.slides({
        version: 'v1',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const result = yield service.presentations.get({
        presentationId,
        fields: 'slides/objectId',
    });
    const pageObjects = result.data.slides.map(({ objectId }) => objectId);
    return pageObjects.slice(0, MAX_SLIDE_COUNT);
});
const getThumbnailUrl = (token, presentationId, pageObjectId) => __awaiter(void 0, void 0, void 0, function* () {
    const service = googleapis_1.google.slides({
        version: 'v1',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = yield service.presentations.pages
        .getThumbnail({
        presentationId,
        pageObjectId,
        'thumbnailProperties.mimeType': 'PNG',
        'thumbnailProperties.thumbnailSize': IMAGE_SIZE,
    });
    return data.data.contentUrl;
});
const getImageLinks = (token, presentationId) => __awaiter(void 0, void 0, void 0, function* () {
    const slidesId = yield getSlideObjects(token, presentationId);
    const tA = [];
    for (const slide of slidesId) {
        const theme_page = yield getThumbnailUrl(token, presentationId, slide);
        tA.push(theme_page);
    }
    return tA;
});
function createPresentation(token, title) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = googleapis_1.google.slides({
            version: 'v1',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return service.presentations.create({
            title,
        });
    });
}
// async function getPresentationData(token, presentationId: string) {
//   const service = google.slides({
//     version: 'v1',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//   return  service.presentations.get({
//       presentationId: presentationId,
//     });
// }
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
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive'
];
router.get('/oauth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('oauth');
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    console.log(url);
    res.redirect(url);
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('/');
    if (req.query.code === undefined) {
        return res.send('Presentation Builder a Jotform/Google Slides/PDFkit integration');
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
    let user_token = '';
    const user_email = req.query.email;
    const user = yield (0, user_1.getUserFromEmail)(user_email);
    const jsonUser = JSON.parse(user);
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
    const urlslide = `https://docs.google.com/presentation/d/${created_presentation_id}/edit#slide=id.p`;
    res.redirect(urlslide);
}));
router.get('/create-presentation/google-slides', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user_token = '';
    const user_email = req.query.email;
    const user_name = req.query.name;
    const user = yield (0, user_1.getUserFromEmail)(user_email);
    const jsonUser = JSON.parse(user);
    user_token = jsonUser.access_token;
    const isValid = yield (0, refresh_token_1.verifyGoogleToken)(jsonUser.access_token);
    if (!isValid) {
        const ntoken = yield (0, refresh_token_1.obterTokenDeAtualizacao)(jsonUser, user_email);
        user_token = ntoken;
    }
    const introId = '1EOBoPZHmHq7zhwhgWm-6yfn6OWSOp2hWxtcEnqAfRfs';
    const coopId = '1Gmq76r3UPbgfGXnx8YjKnTtVMo5bTrPDh23jZmnlN7A';
    const introdutionSlidesIds = yield getSlideObjects(user_token, introId);
    const introdutionThumbnail = yield getThumbnailUrl(user_token, introId, introdutionSlidesIds[0]);
    const requests = [
        {
            deleteObject: {
                objectId: 'p'
            },
        }
    ];
    const introduction_slide_id = (0, uuid_1.v4)();
    requests.push({
        createSlide: {
            objectId: introduction_slide_id,
        }
    });
    requests.push({
        updatePageProperties: {
            objectId: introduction_slide_id,
            pageProperties: {
                pageBackgroundFill: {
                    stretchedPictureFill: {
                        contentUrl: introdutionThumbnail,
                        size: {
                            height: {
                                magnitude: 407,
                                unit: 'PT'
                            },
                            width: {
                                magnitude: 700,
                                unit: 'PT'
                            }
                        }
                    }
                }
            },
            fields: 'pageBackgroundFill'
        }
    });
    const coopThumbNailsArray = yield getImageLinks(user_token, coopId);
    coopThumbNailsArray.forEach(thumbnail => {
        const innerIntroduction_slide_id = (0, uuid_1.v4)();
        requests.push({
            createSlide: {
                objectId: innerIntroduction_slide_id,
            }
        });
        requests.push({
            updatePageProperties: {
                objectId: innerIntroduction_slide_id,
                pageProperties: {
                    pageBackgroundFill: {
                        stretchedPictureFill: {
                            contentUrl: thumbnail,
                            size: {
                                height: {
                                    magnitude: 407,
                                    unit: 'PT'
                                },
                                width: {
                                    magnitude: 700,
                                    unit: 'PT'
                                }
                            }
                        }
                    }
                },
                fields: 'pageBackgroundFill'
            }
        });
    });
    const presentation = yield createPresentation(user_token, user_name);
    const created_presentation_id = presentation.data.presentationId;
    yield createSlide(user_token, created_presentation_id, requests);
    const urlslide = `https://docs.google.com/presentation/d/${created_presentation_id}/edit#slide=id.p`;
    res.redirect(urlslide);
}));
router.get('/create-presentation/slide-builder', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageSlide_Background = 'https://lh3.googleusercontent.com/d/1VF5pK-LZ8r9WJGrqPGT0MTtPxirxvS8u';
    const imageSlide_Crescer = 'https://lh3.googleusercontent.com/d/184BJy5NdcN0G2c31oqJkLE6tEkgemBjY';
    const imageSlide_Sicred = 'https://lh3.googleusercontent.com/d/18I_-9odeS9u95BojYLx-di-khJni73MM';
    const larguratotal = (25.4);
    // const alturatotal = (14.29)  
    let user_token = '';
    const user_email = req.query.email;
    const user_name = req.query.name;
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
        createSlide: {
            objectId: slide_01_id
        }
    });
    // adding background
    const updatedWithBackGround = (0, g_slides_elements_1.pushImageInRequest)('background_wave', slide_01_id, imageSlide_Background, (0, unit_converts_1.cmToPoints)(0), (0, unit_converts_1.cmToPoints)(8.85), (0, unit_converts_1.cmToPoints)(larguratotal), (0, unit_converts_1.cmToPoints)(5.14), requests);
    const updatedWithSicredGround = (0, g_slides_elements_1.pushImageInRequest)('sicred_logo', slide_01_id, imageSlide_Sicred, (0, unit_converts_1.cmToPoints)(17.4), (0, unit_converts_1.cmToPoints)(12), (0, unit_converts_1.cmToPoints)(7.19), (0, unit_converts_1.cmToPoints)(2.12), updatedWithBackGround);
    const updatedWithCrescerGround = (0, g_slides_elements_1.pushImageInRequest)('crescer_logo', slide_01_id, imageSlide_Crescer, (0, unit_converts_1.cmToPoints)((larguratotal / 2) - (10.28 / 2)), (0, unit_converts_1.cmToPoints)(0.1), (0, unit_converts_1.cmToPoints)(10.28), (0, unit_converts_1.cmToPoints)(3.76), updatedWithSicredGround);
    const updateWithTitle = (0, g_slides_elements_1.pushTextInRequest)(title_slide_01_id, slide_01_id, 'Briefing - REUNIÃO', (0, unit_converts_1.cmToPoints)(((larguratotal / 2) - (22 / 2))), (0, unit_converts_1.cmToPoints)(3.5), (0, unit_converts_1.cmToPoints)(22), (0, unit_converts_1.cmToPoints)(2.30), 'Exo 2', 50, true, false, {
        red: 0.6,
        green: 0.6,
        blue: 0.6,
    }, updatedWithCrescerGround);
    const updateWithSubTitle = (0, g_slides_elements_1.pushTextInRequest)(subtitle_slide_01_id, slide_01_id, 'Reconstrução formações do Crescer', (0, unit_converts_1.cmToPoints)(((larguratotal / 2) - (16.32 / 2))), (0, unit_converts_1.cmToPoints)(6), (0, unit_converts_1.cmToPoints)(16.32), (0, unit_converts_1.cmToPoints)(1.30), 'Exo 2', 27, false, true, {
        red: 0.6,
        green: 0.6,
        blue: 0.6,
    }, updateWithTitle);
    const updateWithSubinfo = (0, g_slides_elements_1.pushTextInRequest)(subinfo_slide_01_id, slide_01_id, 'IVAN ZICHTL -2024', (0, unit_converts_1.cmToPoints)(1.91), (0, unit_converts_1.cmToPoints)(9), (0, unit_converts_1.cmToPoints)(6.51), (0, unit_converts_1.cmToPoints)(1), 'Exo 2', 16, false, false, {
        red: 0.6,
        green: 0.6,
        blue: 0.6,
    }, updateWithSubTitle);
    const presentation = yield createPresentation(user_token, user_name);
    const created_presentation_id = presentation.data.presentationId;
    yield createSlide(user_token, created_presentation_id, updateWithSubinfo);
    const urlslide = `https://docs.google.com/presentation/d/${created_presentation_id}/edit#slide=id.p`;
    res.redirect(urlslide);
    // res.send({ 'url': `https://docs.google.com/presentation/d/${created_presentation_id}/edit#slide=id.p` })
}));
exports.default = router;
//# sourceMappingURL=google-handler.js.map