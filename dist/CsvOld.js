"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Jsonata_1 = require("./Jsonata");
function mapData(array, jsonatas) {
    return array.map((element) => mapFields(element, jsonatas));
}
function mapFields(obj, jsonatas) {
    return jsonatas.map((jsonata) => runJsonata(obj, jsonata));
}
function runJsonata(obj, jsonata) {
    let value = Jsonata_1.default(Object.assign({}, obj, { _jsonata: jsonata, _toObj: false }));
    if (value === undefined) {
        console.error(`Failed to find data at '${jsonata}' in ${JSON.stringify(obj)}`);
        value = '';
    }
    else {
        // escape quotes
        if (typeof value === 'string') {
            // escape existing quotes
            // wrap in quotes to prevent a string with a comma from breaking the CSV
            value = `"${value.replace("\"", "\\\"")}"`;
        }
    }
    return value;
}
function main(params) {
    const { _path: path, _delim: delim = ',', _fields: fields, _titles: titles, _retain: retain = false } = params;
    let csv = `${titles}\n`;
    const array = Jsonata_1.default(Object.assign({}, params, { _jsonata: path, _toObj: false }));
    console.log(`Found ${array.length} elements at path '${path}'`);
    const results = mapData(array, fields.split(','));
    results.forEach((element) => {
        csv += `${element.join(delim)}\n`;
    });
    const data = {
        _data: csv
    };
    if (retain) {
        return Object.assign({}, params, data); // the incoming params will be retained in the resulting object
    }
    else {
        return data;
    }
}
exports.default = main;
global.main = main; // required when using webpack
