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
exports.patchToPublicFile = exports.getFile = exports.getFileStream = exports.getPublicLink = exports.deleteFile = exports.uploadPDF = void 0;
const googleapis_1 = require("googleapis");
// import fs from 'fs'
// import { publicDirPath } from '../../index';
require("dotenv").config();
function uploadPDF(token, buffer, size) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Criando pdf ID:');
        let id = '';
        const service = googleapis_1.google.drive({
            version: 'v2',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const fileMetadata = {
            title: 'photo.pdf',
        };
        const media = {
            mimeType: 'application/pdf',
            body: buffer
        };
        try {
            const file = yield service.files.insert({
                resource: fileMetadata,
                media: media,
                fields: 'id',
            });
            return file.data.id;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.uploadPDF = uploadPDF;
function deleteFile(token, presentationId) {
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
exports.deleteFile = deleteFile;
function getPublicLink(token, fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = googleapis_1.google.drive({
            version: 'v3',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return service.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });
    });
}
exports.getPublicLink = getPublicLink;
function getFileStream(token, fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = googleapis_1.google.drive({
            version: 'v3',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return service.files.get({
            fileId,
            alt: 'media',
        }, { responseType: 'stream' });
    });
}
exports.getFileStream = getFileStream;
function getFile(token, fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = googleapis_1.google.drive({
            version: 'v3',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return service.files.get({
            fileId: fileId
        });
    });
}
exports.getFile = getFile;
function patchToPublicFile(token, fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const service = googleapis_1.google.drive({
            version: 'v3',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return service.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
    });
}
exports.patchToPublicFile = patchToPublicFile;
//# sourceMappingURL=drive-api-functions.js.map