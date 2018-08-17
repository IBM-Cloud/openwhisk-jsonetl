import Data from './Data';
import Jsonata, { JsonataParams } from './Jsonata';

import * as openwhisk from 'openwhisk';

export interface EachParams {
  _path: string;
  _action: string;
  _blocking?: boolean;
}

export default async function main(params: EachParams): Promise<Data> {
  const ow = openwhisk();

  const { _action: name, _path: path, _blocking: blocking = false} = params;
  const array: any[] = Jsonata({...params as any, ...{_jsonata: path, _toObj: false} as JsonataParams});

  console.log(`Running '${name}' action on ${array.length} elements at path '${path}'`);

  // run the action on each element
  const owActions = array.map((params: any) => {
    return ow.actions.invoke({
      name,
      blocking,
      result: true,
      params
    });
  });

  // run all actions and return
  return {
    _data: await Promise.all(owActions)
  };
}

(<any>global).main = main;  // required when using webpack