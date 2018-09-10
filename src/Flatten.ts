export interface FlattenParams {
  _keys: string;
  _array: string;
}

export default function main(params: FlattenParams): any {
  const { _array: array } = params;
  const keys = params._keys.split(',');

  const flatter = {};
  flatter[array] = params[array].map((obj: any) => {
    keys.forEach((key: string) => obj[key] = params[key]);
    return obj;
  })

  return flatter;

}