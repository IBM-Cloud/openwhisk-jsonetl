import Data from './Data';
import Jsonata, { JsonataParams } from './Jsonata';

import * as rp from 'request-promise';

export interface RequestParams {
  _url: string;
  _username?: string;
  _password?: string;
  _bearer?: string;
  _json?: boolean;
  _method?: string;
  _body?: any;
  _jsonata?: string;
  _retain?: boolean;
}

export default async function main(params: RequestParams): Promise<Data> {
  const {
    _username: user,
    _password: pass,
    _bearer: bearer,
    _json: json = true,
    _method: method = 'GET',
    _body: body,
    _jsonata: jsonata,
    _retain: retain = false
  } = params;

  let { _url: url } = params;
  url = substitute(url, params);

  const options: rp.RequestPromiseOptions = {
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
    
    if (typeof body === 'string') {
      // perform substitution on the string payload
      const subBody = substitute(body, params);

      // if it's stated as application/json, convert to an object
      options.body = json ? JSON.parse(subBody) : subBody;
    } else {
      options.body = body;
    }
  }

  console.log(`${options.method} request to ${url} auth=${options.auth.user && options.auth.pass ? 'basic' : (options.auth.bearer ? 'bearer' : 'none')} body=${body ? JSON.stringify(options.body) : 'none'}`);

  // wrap the response since sometimes the result is not a JSON object (e.g. an array)
  let response = await rp(url, options);

  if (jsonata) {
    response = Jsonata({...response, ...{ _jsonata: jsonata, _toObj: false } as JsonataParams});
  }

  const data =  {
    _data: response
  };

  if (retain) {
    return {...params, ...data} as Data; // the incoming params will be retained in the resulting object
  } else {
    return data;
  }
}

function substitute(templatedString: string, params: any) {
  console.log(`Process substitutions for ${templatedString}`);

  let result = templatedString;
  
  // replace anything of the form {{expression}}
  const replacements = templatedString.match(/{{[^}]*}}/gi);

  if (replacements) {
    console.log(`Found ${replacements} substitution(s)`);

    result = replacements.reduce((url: string, replacement: string) => {
      const _jsonata = replacement.substring(2, replacement.length-2);
      const value = Jsonata({...params as any, ...{ _jsonata, _toObj: false } as JsonataParams});
      
      return url.replace(replacement, value);
    }, templatedString);
  }

  return result;
}

(<any>global).main = main;  // required when using webpack