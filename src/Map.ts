import Jsonata, { JsonataParams } from './Jsonata';

export interface MapParams {
  _keys?: string;
  _jsonatas: string;
}

export default function main(params: any): any {
  const keys: string[] = params._keys.split(',');
  const jsonatas: string[] = params._jsonatas.trim().split(';');

  if (keys.length !== jsonatas.length) {
    throw Error(`Map output keys ${keys} and jsonata expressions ${jsonatas} do not match`);
  }

  // TODO handle arrays and map each element

  keys.forEach((key, i) => {
    const obj = Jsonata({...params as any, ...{_jsonata: jsonatas[i], _toObj: false} as JsonataParams});

    // only assign if obj !== undefined or null; this supports the use case where a user can map to a single
    // key for multiple jsonatas (e.g. different types of incoming objects) without resulting in undefined for
    // a key
    if (obj) {
      params[keys[i]] = obj;
    }
  });

  delete params._keys;
  delete params._jsonatas;

  return params;
}

(<any>global).main = main;  // required when using webpack