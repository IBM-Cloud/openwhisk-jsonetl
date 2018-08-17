import Data from './Data';

import Jsonata, { JsonataParams } from './Jsonata';

function mapData (array: any[], jsonatas: string[]): any[][] {
  return array.map((element: any) => mapFields(element, jsonatas));
}

function mapFields (obj: any, jsonatas: string[]): any[] {
  return jsonatas.map((jsonata: string) => runJsonata(obj, jsonata));
}

function runJsonata(obj: any, jsonata: string) {
  let value = Jsonata({...obj, ...{_jsonata: jsonata, _toObj: false} as JsonataParams});

  if (value === undefined) {
    console.error(`Failed to find data at '${jsonata}' in ${JSON.stringify(obj)}`);
    value = '';
  } else {
    // escape quotes
    if (typeof value === 'string'){
      // escape existing quotes
      // wrap in quotes to prevent a string with a comma from breaking the CSV
      value = `"${value.replace("\"", "\\\"")}"`;
    }
  }

  return value;
}

export interface CsvParams {
  _titles: string;  // comma separated titles seen as first row in CSV
  _path: string;    // jsonata that matches the property containing array data
  _fields: string;  // comma separated jsonata expressions to get data
  _delim?: string;  // fields delimiter
  _retain?: boolean;
}

export default function main(params: CsvParams): Data {
  const { _path: path, _delim: delim = ',', _fields: fields, _titles: titles, _retain: retain = false } = params;
  
  let csv = `${titles}\n`;

  const array: any[] = Jsonata({...params as any, ...{_jsonata: path, _toObj: false} as JsonataParams});

  console.log(`Found ${array.length} elements at path '${path}'`);

  const results = mapData(array, fields.split(','));
  results.forEach((element: any[]) => {
    csv += `${element.join(delim)}\n`;
  });

  const data =  {
    _data: csv
  };

  if (retain) {
    return {...params, ...data} as Data; // the incoming params will be retained in the resulting object
  } else {
    return data;
  }
}

(<any>global).main = main;  // required when using webpack