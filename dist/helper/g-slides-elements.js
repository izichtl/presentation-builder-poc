"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushTextInRequest = exports.pushImageInRequest = void 0;
// @ts-nocheck
const pushImageInRequest = (objectId, introduction_slide_id, imgUrl, xPt, yPt, largura, altura, requests) => {
    const xEmu = xPt * 12700;
    const yEmu = yPt * 12700;
    console.log('adding img', objectId);
    requests.push({
        createImage: {
            objectId: objectId,
            url: imgUrl,
            elementProperties: {
                pageObjectId: introduction_slide_id,
                size: {
                    height: { magnitude: altura, unit: 'PT' },
                    width: { magnitude: largura, unit: 'PT' }
                },
                transform: {
                    scaleX: 1,
                    scaleY: 1,
                    translateX: xEmu,
                    translateY: yEmu,
                    unit: 'EMU'
                }
            }
        }
    });
    return requests;
};
exports.pushImageInRequest = pushImageInRequest;
const pushTextInRequest = (text_id, slide_id, text_data, start_x, start_y, width, heigth, font_family, font_size, bold, italic, color, request) => {
    console.log('adding text', text_id);
    // create shape and text 
    request.push({
        createShape: {
            objectId: text_id,
            shapeType: 'TEXT_BOX',
            elementProperties: {
                pageObjectId: slide_id,
                size: {
                    height: {
                        magnitude: heigth,
                        unit: 'PT',
                    },
                    width: {
                        magnitude: width,
                        unit: 'PT',
                    },
                },
                transform: {
                    scaleX: 1,
                    scaleY: 1,
                    translateX: start_x,
                    translateY: start_y,
                    unit: 'PT',
                },
            },
        },
    }, {
        insertText: {
            objectId: text_id,
            insertionIndex: 0,
            text: text_data,
        },
    });
    // update text style
    request.push({
        updateTextStyle: {
            objectId: text_id,
            textRange: {
                type: 'ALL'
            },
            style: {
                fontFamily: font_family,
                fontSize: {
                    magnitude: font_size,
                    unit: 'PT'
                },
                foregroundColor: {
                    opaqueColor: {
                        rgbColor: {
                            red: color.red,
                            green: color.green,
                            blue: color.blue
                        }
                    }
                },
                bold: bold,
                italic: italic
            },
            fields: 'fontFamily,fontSize,bold,italic,foregroundColor'
        }
    });
    // adjustment in shape and text alignment
    request.push({
        updateParagraphStyle: {
            objectId: text_id,
            style: {
                alignment: "CENTER"
            },
            fields: 'alignment',
        }
    });
    request.push({
        updateShapeProperties: {
            objectId: text_id,
            shapeProperties: {
                contentAlignment: 'MIDDLE'
            },
            fields: "contentAlignment",
        }
    });
    return request;
};
exports.pushTextInRequest = pushTextInRequest;
//# sourceMappingURL=g-slides-elements.js.map