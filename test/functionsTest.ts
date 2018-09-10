import Request, { RequestParams } from '../src/Request';
import Flatten, { FlattenParams } from '../src/Flatten';

import { expect } from 'chai';

describe('openwhisk-JSONetl', function () {

  it ('request', async () => {
    const res = await Request({
      _url: 'http://jsonplaceholder.typicode.com/todos/1'
    } as RequestParams);

    expect(res).to.not.be.undefined;
  });

  it ('request with substitution', async () => {
    const res = await Request({
      _url: 'http://jsonplaceholder.typicode.com/{{route}}/{{some.samples[0].input}}',
      route: 'todos',
      some: { samples: [ { input: 1 } , { input: 2 } ] }
    } as RequestParams);

    expect(res).to.not.be.undefined;
  });

  it('flatten', () => {
    const params = {
      _keys: "foo,bar",
      _array: "list",
      foo: 'foo',
      bar: 'bar',
      list: [
        {},
        {}
      ]
    };

    const flatter = Flatten(params as FlattenParams);
    console.log(flatter);

    expect(flatter.list[0].bar).to.equal(params.bar);
    expect(flatter.list[1].foo).to.equal(params.foo);
  });

});