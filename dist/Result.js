"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toObj(data, params) {
    // wrap the data as an object if it is a primitive
    if (typeof data !== 'object' || Array.isArray(data)) {
        console.log(`Wrapping as result ${JSON.stringify(data)}`);
        data = {
            data
        };
    }
    // include properties from the parent in the result
    if (params && params._retain) {
        params._retain.split(',').forEach((key) => {
            data[key] = params[key];
        });
    }
    return data;
}
exports.default = toObj;
