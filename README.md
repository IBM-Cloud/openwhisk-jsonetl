# OpenWhisk JSONetl

The OpenWhisk JSONetl package models an extract-transform-load pipeline as OpenWhisk Functions. Functions themselves are often succinct and highly parallelized. This makes them ideal for efficient, on-demand batch processing of data.

## Modeling as functions

The business scenario and technical underpinning can be easily modeled as functions. Functions inherently support the concept of a pipeline as they already follow a flow-based programming model. Each step in a business process is modeled as an OpenWhisk **Action**. For every Action, there is an input and output object. Actions can be chained together into a **Sequence**, which passes the input/output data along. Metadata in the form of **Parameters** provide instructions to control behavior of Actions.

## Functions available

- [Csv](/doc/Csv.md)
- [Each](/doc/Each.md)
- [Flatten](/doc/Flatten.md)
- [Jsonata](/doc/Jsonata.md)
- [Map](/doc/Map.md)
- [Pick](/doc/Pick.md)
- [Request](/doc/Request.md)

## Assembling functions

A business process is assembled declaratively using [wskdeploy](https://github.com/apache/incubator-openwhisk-wskdeploy) and OpenWhisk actions and sequences.

### Creating a dependency

In your wskdeploy `manifest.yaml` file, declare a dependency on JSONetl. This creates a dependency called `openwhisk-jsonetl` that will deploy the JSONetl actions when you deploy your package.

```yaml
packages:
  my-etl-process:
    version: 1.0
    license: Apache-2.0
    dependencies:
      jsonetl:
        location: github.com/IBM-Cloud/openwhisk-jsonetl
```

### Sample usage

To use JSONetl functions, reference them as part of a sequence. A simplified way to do this is to:

1. Define an action that collects the parameters used to control the function.
2. Create a sequence that models a business process.
3. Order your actions and JSONetl actions to build a process.

An example of the above could be the following.

```yaml
packages:
  openwhisk-jsonetl-samples:
    version: 1.0
    license: Apache-2.0
    dependencies:
      jsonetl:
        location: github.com/IBM-Cloud/openwhisk-jsonetl
    actions:
      users:
        code: function main(params) { return params; }
        runtime: nodejs:8
        inputs:
          _url: https://jsonplaceholder.typicode.com/users
      first-user:
        code: function main(params) { return params; }
        runtime: nodejs:8
        inputs:
          _keys: userId,userName
          _jsonatas: data[0].id;data[0].name
      user-posts:
        code: function main(params) { return params; }
        runtime: nodejs:8
        inputs:
          _url: https://jsonplaceholder.typicode.com/posts?userId={{userId}}
          _retain: userId,userName
      copy-user-name:
        code: function main(params) { return params; }
        runtime: nodejs:8
        inputs:
          _keys: userName
          _array: data
    sequences:
      get-users:
        actions: users,openwhisk-jsonetl/request
      get-first-user:
        actions: get-users,first-user,openwhisk-jsonetl/pick
      get-posts:
        actions: get-first-user,user-posts,openwhisk-jsonetl/request,copy-user-name,openwhisk-jsonetl/flatten
```

Invoke the sequences from the command line.

Make a simple request to a URL:
```sh
ibmcloud fn action invoke openwhisk-jsonetl-samples/get-users -r
```

Use the output from `get-users` to select the first user in the list and only return `userId=<id>` and `userName=<name>` from the data.
```sh
ibmcloud fn action invoke openwhisk-jsonetl-samples/get-first-user -r
```

Use the output from above to get a user's posts and copy the `userName` property into each post object.
```sh
ibmcloud fn action invoke openwhisk-jsonetl-samples/get-posts -r
```
