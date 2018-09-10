import Result from './Result';

import * as jsonata from 'jsonata';

export interface JsonataParams {
  _jsonata: string; // jsonata to run on the object
  _toObj?: boolean; // true ensures the result in an object
}

export default function main(params: JsonataParams): any {
  const { _jsonata: expr, _toObj: toObj = true } = params;

  if (expr) {
    console.log(`Evaluate '${expr}' and return an object ${toObj}`);

    const data = jsonata(expr).evaluate(params);

    if (!data) {
      console.error(`No value found at '${expr}' for object ${JSON.stringify(params)}`);
    }

    // wrap the response since sometimes the result is not a JSON object (e.g. an array)
    // this is the default behavior since Functions expects an object
    if (toObj) {
      return Result(data);
    } else {
      // provide back the raw result (i.e. I know it's an array and I want an array)
      return data;
    }
  } else {
    console.log(`No jsonata to evaluate - returning original object`);
    return params;
  }
}

(<any>global).main = main;  // required when using webpack