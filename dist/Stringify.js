"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function main(params) {
    const keys = params._keys.split(',');
    keys.forEach((key) => {
        const value = params[key];
        params[key] = JSON.stringify(value).substring(1, value.length + 1); // trim the leading and trailing "
    });
    return params;
}
exports.default = main;
