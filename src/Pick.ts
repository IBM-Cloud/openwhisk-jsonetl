import Jsonata, { JsonataParams } from "./Jsonata";

export interface PickParams {
  _keys: string;
  _jsonatas: string;
}

export default function main(params: PickParams): any {
  const keys: string[] = params._keys.split(',');
  const jsonatas: string[] = params._jsonatas.trim().split(';');

  if (keys.length !== jsonatas.length) {
    throw Error(`Pick output keys ${keys} and jsonata expressions ${jsonatas} do not match`);
  }

  const picked = {};

  keys.forEach((key, i) => {
    picked[key] = Jsonata({...params as any, ...{_jsonata: jsonatas[i], _toObj: false} as JsonataParams});
  });

  return picked;
}

(<any>global).main = main;  // required when using webpack