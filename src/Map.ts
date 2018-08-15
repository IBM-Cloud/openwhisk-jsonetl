import Jsonata, { JsonataParams } from './Jsonata';

export interface MapParams {
  _input: string;
  _output: string;
  _path?: string;
  _delete?: boolean;
}

export default function main(params: any): any {
  let { _path: path, _input: input, _output: output, _delete: del = true } = params;

  const inKeys: string[] = input.split(',');
  const outKeys: string[] = output.split(',');

  if (inKeys.length !== outKeys.length) {
    throw Error(`Map input and output keys do not match`);
  }

  // Jsonata will handle an undefined path by returning the original object
  const obj = Jsonata({...params as any, ...{_jsonata: path, _toObj: false} as JsonataParams});

  if (!obj) {
    throw Error(`Failed to find object at path '${path}`);
  }

  console.log(`Mapping ${inKeys} to ${outKeys} in ${JSON.stringify(obj)}`);

  // TODO handle arrays and map each element

  inKeys.forEach((key, i) => {
    obj[outKeys[i]] = obj[key];

    if (del) {
      delete obj[key];
    }
  });

  return obj;
}

(<any>global).main = main;  // required when using webpack