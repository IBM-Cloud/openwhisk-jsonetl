"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Jsonata_1 = require("./Jsonata");
function main(params) {
    const keys = params._keys.split(',');
    const jsonatas = params._jsonatas.split(',');
    if (keys.length !== jsonatas.length) {
        throw Error(`Pick output keys and jsonata expressions do not match`);
    }
    const picked = {};
    keys.forEach((key, i) => {
        picked[key] = Jsonata_1.default(Object.assign({}, params, { _jsonata: jsonatas[i], _toObj: false }));
    });
    return picked;
}
exports.default = main;
