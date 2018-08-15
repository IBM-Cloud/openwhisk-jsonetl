"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Jsonata_1 = require("./Jsonata");
const rp = require("request-promise");
function main(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { _username: user, _password: pass, _bearer: bearer, _json: json = true, _method: method = 'GET', _body: body } = params;
        let { _url: url } = params;
        const options = {
            method,
            json
        };
        if (user && pass) {
            options.auth = { user, pass };
        }
        if (bearer) {
            options.auth = { bearer };
        }
        if (method) {
            options.method = method;
        }
        if (body) {
            options.method = 'POST';
            options.body = body;
        }
        // replace anything of the form {{expression}}
        const replacements = url.match(/{{[^}]*}}/gi);
        if (replacements) {
            console.log(`Found ${replacements.length} substitution(s) in URL`);
            url = replacements.reduce((url, replacement) => {
                const _jsonata = replacement.substring(2, replacement.length - 2);
                const value = Jsonata_1.default(Object.assign({}, params, { _jsonata, _toObj: false }));
                return url.replace(replacement, value);
            }, url);
        }
        console.log(`${method} request to ${url} auth=${user && pass ? 'basic' : (bearer ? 'bearer' : 'none')} body=${body ? JSON.stringify(body) : 'none'}`);
        // wrap the response since sometimes the result is not a JSON object (e.g. an array)
        return {
            _data: yield rp(url, options)
        };
    });
}
exports.default = main;
