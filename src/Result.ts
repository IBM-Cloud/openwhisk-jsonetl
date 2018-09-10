export default function toObj(data: any, params?: any) {
  // wrap the data as an object if it is a primitive
  if (typeof data !== 'object' || Array.isArray(data)) {
    console.log(`Wrapping as result ${JSON.stringify(data)}`);
    data = {
      data
    };
  }

  // include properties from the parent in the result
  if (params && params._retain) {
    params._retain.split(',').forEach((key: string) => {
      data[key] = params[key];
    });
  }

  return data;
}