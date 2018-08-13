import Data from './Data';

import * as rp from 'request-promise';

export interface RequestParams {
  _url: string;
  _username?: string;
  _password?: string;
  _bearer?: string;
  _json?: boolean;
  _method?: string;
  _body?: any;
}

export default async function main(params: RequestParams): Promise<Data> {
  const {
    _url: url,
    _username: user,
    _password: pass,
    _bearer: bearer,
    _json: json = true,
    _method: method = 'GET',
    _body: body
  } = params;

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
    options.body = body;
  }

  console.log(`${method} request to ${url} auth=${user && pass ? 'basic' : (bearer ? 'bearer' : 'none')} body=${body ? JSON.stringify(body) : 'none'}`);
  
  // wrap the response since sometimes the result is not a JSON object (e.g. an array)
  return {
    _data: await rp(url, options)
  };
}