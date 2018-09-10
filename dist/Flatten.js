"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function main(params) {
    const { _array: array } = params;
    const keys = params._keys.split(',');
    const flatter = {};
    flatter[array] = params[array].map((obj) => {
        keys.forEach((key) => obj[key] = params[key]);
        return obj;
    });
    return flatter;
}
exports.default = main;
