
import Data from './Data';

import * as jsonata from 'jsonata';

export interface JsonataParams {
  _jsonata: string; // jsonata to run on the object
  _toObj?: boolean; // true wraps the result in an object with a _data property
}

export default function main(params: JsonataParams): Data | any {
  const { _jsonata: expr, _toObj: toObj = true } = params;

  if (expr) {
    console.log(`Evaluate '${expr}' and return an object ${toObj}`);

    // wrap the response since sometimes the result is not a JSON object (e.g. an array)
    // this is the default behavior since Functions expects an object
    if (toObj) {
      return {
        _data: jsonata(expr).evaluate(params)
      } as Data;
    } else {
      // provide back the raw result (i.e. I know it's an array and I want an array)
      return jsonata(expr).evaluate(params);
    }
  } else {
    console.log(`No jsonata to evaluate - returning original object`);
    return params;
  }
}

(<any>global).main = main;  // required when using webpack