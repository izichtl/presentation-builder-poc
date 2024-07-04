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
exports.getImageLinks = exports.deletePresentation = exports.createSlide = exports.createPresentation = void 0;
const googleapis_1 = require("googleapis");
require("dotenv").config();
const SIZE = {
    UNSPECIFIED: 'THUMBNAIL_SIZE_UNSPECIFIED',
    LARGE: 'LARGE',
    MEDIUM: 'MEDIUM',
    SMALL: 'SMALL',
};
const IMAGE_SIZE = SIZE.LARGE;
const MAX_SLIDE_COUNT = 10;
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
exports.createPresentation = createPresentation;
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
exports.createSlide = createSlide;
function deletePresentation(token, presentationId) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = googleapis_1.google.drive({
            version: 'v3',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return service.files.update({
            fileId: presentationId,
            requestBody: {
                'trashed': true
            },
        });
    });
}
exports.deletePresentation = deletePresentation;
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
    const result = [];
    for (const slide of slidesId) {
        const theme_page = yield getThumbnailUrl(token, presentationId, slide);
        result.push(theme_page);
    }
    return result;
});
exports.getImageLinks = getImageLinks;
//# sourceMappingURL=slides-api-functions.js.map