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
exports.slidesRequestBuilder = void 0;
// @ts-nocheck 
const uuid_1 = require("uuid");
const image_path_1 = require("../storage/image-path");
const processarTemas = (temasString) => {
    const temas = JSON.parse(temasString);
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
    processarTemas(data.thema_list).forEach(theme_item => {
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
//# sourceMappingURL=g-slides-builder.js.map