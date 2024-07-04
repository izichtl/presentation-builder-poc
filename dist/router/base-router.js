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
const sender_1 = require("../api/sender");
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('@@@');
    console.log(req.body);
    const chat = yield (0, sender_1.updateChat)('izichtl@gmail.com', '1QD78kQgJiJMtixVKIlqgTZtZ9-GLBj3w', 'arco-whatsapp-555121651571', '5521982608223');
    console.log(chat);
    res.send({
        success: true,
        uuid: (0, uuid_1.v4)()
    });
}));
exports.default = router;
//# sourceMappingURL=base-router.js.map