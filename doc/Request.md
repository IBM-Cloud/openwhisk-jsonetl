### Request

Makes an HTTP request by using Request and Request-Promise. Both are natively available on OpenWhisk. This returns a Promise. You can support variable substitution in the URL by passing an input object and declaring JSONata to create a replacement value. For example, passing the input object `{route: "foo" , _url: 'http://ibm.com/{{route}}'}` yields `http://ibm.com/foo` as the URL. More complex substitution is also possible with `{complex: { entity: ["foo","bar"] } , _url: 'http://ibm.com/{{complex.entity[0]}}'}`  You can also substitute inside the `_body` as well. Just pass in a string with more templated values.

| Input | Description |
| --- | ---  |
| _url: string | The URL to request |
| _username?: string | A username if basic auth is to be used |
| _password?: string | A password if basic auth is to be used |
| _bearer?: string | A token if bearer authorization is to be used |
| _json?: boolean | True if the request/response is JSON |
| _method?: string | The HTTP method (e.g. GET or POST) |
| _body?: any | The body to POST if any |
| _jsonata?: any | JSONata applied to the response (this becomes the output of Request) |
| _retain?: string | Retains a list of input property value pairs in the response |
