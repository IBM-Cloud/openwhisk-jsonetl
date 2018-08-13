import Data from './Data';

export default function main(params: any): Data {
  console.log(JSON.stringify(params));
  return {
    _data: params
  }
}
