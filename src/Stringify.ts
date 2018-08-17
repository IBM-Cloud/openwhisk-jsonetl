export interface StringifyParams {
  _keys: string;
}

export default function main(params: StringifyParams): any {
  const keys: string[] = params._keys.split(',');

  keys.forEach((key) => {
    const value = params[key];
    params[key] = JSON.stringify(value).substring(1, value.length+1); // trim the leading and trailing "
  });

  return params;
}
