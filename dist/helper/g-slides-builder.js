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
exports.pdfPresentationBuilderBySlides = exports.pdfSlidesBuilder = exports.slidesRequestBuilder = void 0;
// @ts-nocheck 
const uuid_1 = require("uuid");
const image_path_1 = require("../storage/image-path");
const axios_1 = __importDefault(require("axios"));
const botmaker_path_1 = require("../storage/botmaker-path");
const introduction_builder_1 = require("./introduction-builder");
const slides_api_functions_1 = require("./google-module/slides-api-functions");
const fetchImage = (src) => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield axios_1.default
        .get(src, {
        responseType: 'arraybuffer'
    });
    return image.data;
});
const processarTemas = (temasString) => {
    const dobleQuoutes = temasString.replaceAll("'", "\"");
    const temas = JSON.parse(dobleQuoutes);
    const temasProcessados = [];
    temas.forEach((tema) => {
        const temaFormatado = tema.Assuntos
            .toLowerCase()
            // .replace(/[\s\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '_');
        temasProcessados.push(`${temaFormatado}`);
    });
    return temasProcessados;
};
const slidesRequestBuilder = (data) => __awaiter(void 0, void 0, void 0, function* () {
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
                        contentUrl: image_path_1.introImgUrl[data.style],
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
    const temasProcessados = processarTemas(data.thema_list);
    temasProcessados.forEach(theme_item => {
        image_path_1.themeImgUrls[theme_item].forEach(element => {
            const thema_slide_id = (0, uuid_1.v4)();
            requests.push({
                createSlide: {
                    objectId: thema_slide_id,
                }
            });
            requests.push({
                updatePageProperties: {
                    objectId: thema_slide_id,
                    pageProperties: {
                        pageBackgroundFill: {
                            stretchedPictureFill: {
                                contentUrl: element,
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
    });
    return {
        title: data.title,
        requests,
    };
});
exports.slidesRequestBuilder = slidesRequestBuilder;
const pdfSlidesBuilder = (data, document, sizes) => __awaiter(void 0, void 0, void 0, function* () {
    const introduction = yield fetchImage(image_path_1.introImgUrl[data.style]);
    // Adicione a página de introdução
    document.image(introduction, { width: sizes.width, height: sizes.height }).text('Stretch', sizes.width, sizes.height);
    const temas = processarTemas(data.thema_list);
    for (const theme_item of temas) {
        const themeImgUrlsForItem = image_path_1.themeImgUrls[theme_item];
        for (const element of themeImgUrlsForItem) {
            const theme_page = yield fetchImage(element);
            document.addPage({ size: [sizes.width, sizes.height], margin: 0 });
            document.image(theme_page, { width: sizes.width, height: sizes.height }).text('Stretch', sizes.width, sizes.height);
        }
    }
});
exports.pdfSlidesBuilder = pdfSlidesBuilder;
const pdfPresentationBuilderBySlides = (data, document, sizes, bt) => __awaiter(void 0, void 0, void 0, function* () {
    const processedIds = [];
    const token = yield (0, introduction_builder_1.authLayer)(data.userEmail);
    const introUrl = yield (0, introduction_builder_1.createIntroduction)(data.userEmail, {
        mood: data.presentationData.mood.toUpperCase(),
        name: data.presentationData.title.toUpperCase()
    });
    const introduction = yield fetchImage(introUrl);
    document.image(introduction, { width: sizes.width, height: sizes.height }).text('Stretch', sizes.width, sizes.height);
    const themes = data.presentationData.theme;
    themes.forEach((tema) => {
        if (tema !== 'FINALIZAR') {
            processedIds.push(botmaker_path_1.themeUrlIds[tema.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')]);
        }
    });
    const addThemes = (innerDocument) => __awaiter(void 0, void 0, void 0, function* () {
        for (const id of processedIds) {
            const thumbNailsArray = yield (0, slides_api_functions_1.getImageLinks)(token, id);
            for (const element of thumbNailsArray) {
                const theme_page = yield fetchImage(element);
                innerDocument.addPage({ size: [sizes.width, sizes.height], margin: 0 });
                innerDocument.image(theme_page, { width: sizes.width, height: sizes.height }).text('Stretch', sizes.width, sizes.height);
            }
        }
        return innerDocument;
    });
    const outDocument = yield addThemes(document);
    return outDocument;
});
exports.pdfPresentationBuilderBySlides = pdfPresentationBuilderBySlides;
//# sourceMappingURL=g-slides-builder.js.map