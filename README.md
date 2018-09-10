# OpenWhisk JSONetl

The OpenWhisk JSONetl package is an approach to modeling an extract-transform-load pipeline as OpenWhisk Functions. Functions themselves are often succinct and highly parallelized. This makes them ideal for efficient, on-demand batch processing of data. Unfortunately, a need arises to manipulate data (the transform stage). While it may be easy for a developer to write a simple function, doing so in an ad hoc manner reduces re-usability and leads to more code writing.

## Typical scenario

Consider a scenario where billing data is retrieved from a series of APIs. In a RESTful system, example models might be: `account`, `organization`, `user`, `bill`, and `line_item`. Thus a typical interaction might be:

1. `GET /account` returns a JSON object with your account `id`.
2. `GET /account/${id}/organizations` returns an array of JSON objects with more data.
3. For each organization object, you `GET /organization/${id}/bill` to get a billing object.
4. And for each `line_item` in the bill you might make note of the `user` in case it requires investigations.

The business need is essentially a chain of API calls with proper inputs and outputs. Ultimately, the scenario - whether it's billing or another use case - has a common set of core functions.

1. Make a request (i.e. GET or POST) to an API.
2. Fetch data such as the `id` to be used in the next step.
3. Make another request.
4. Change the data to support the next step in the pipeline. For example, change and object's `id` to be `accountId`.
5. Process multiple entities (i.e. an array), each of which might call its own pipeline.
6. Output the result to a file or cloud object storage.

## Modeling as functions

The business scenario and technical underpinning can be easily modeled as functions. Functions inherently support the concept of a pipeline as they already follow a flow-based programming model. Each step in the business process is modeled as an OpenWhisk **Action**. For every Action, there is an input and output object. And Actions can be chained together into a **Sequence**, which passes the input/output data along. All that's left is to include metadata in the form of **Parameters** that provide instructions used by the Actions. Visually, it looks like this.

![](flow.png)

- Each **Action** is denoted by a rectangle.
- The text in the box is the code being executed (more on that later).
- The text above the box is the **Parameter(s)** used by the Action. It can be statically defined by the user or dynamic based on what the previous Action sends downstream.
- For each Action, there is a connecting line indicating that the output of one action becomes the input of another. The different colors of the boxes logically group different types of processes. For example, the teal color might be the `GetAccounts` use case.
- Naming and connecting two or more actions creates a **Sequence**.
- Taken all together, they represent an application.

## Function list

To understand what's happening above and the value each step provides, review the functions available. Every function receives an object as input. The object is a combination of the data from a previous action with parameters that control the behavior of the current action.

- [Csv](/doc/Csv.md)
- [Each](/doc/Each.md)
- [Flatten](/doc/Flatten.md)
- [Jsonata](/doc/Jsonata.md)
- [Map](/doc/Map.md)
- [Pick](/doc/Pick.md)
- [Request](/doc/Request.md)

## Assembling functions

The business process is assembled declaratively using [wskdeploy](https://github.com/apache/incubator-openwhisk-wskdeploy) and OpenWhisk actions and sequences.

### Creating a dependency

In your manifest.yaml file, declare a dependency on JSONetl. This creates a dependency called `openwhisk-jsonetl` that will deploy the JSONetl actions when you deploy your package.

```yaml
packages:
  my-etl-process:
    version: 1.0
    license: Apache-2.0
    dependencies:
      jsonetl:
        location: github.com/IBM-Cloud/openwhisk-jsonetl
```

### Referencing a function

To use JSONetl functions, you reference them as part of a sequence. A simplified way to do this is to:

1. Define an action that collects the parameters used to control the function.
2. Create a sequence that models a business process.
3. Order your actions and JSONetl actions to build a process.

An example of the above could be the following.

```yaml
actions:
  orgs:
    code: function main(params) { return params; }
    runtime: nodejs:8
    inputs:
      _url: https://api.ng.bluemix.net/v2/organizations?order-by=name
      _bearer: ${UAA_TOKEN}
sequences:
  get-orgs:
    actions: orgs,openwhisk-jsonetl/request
```

And invoke the sequence from the command `ibmcloud wsk action invoke myPackage/get-orgs -r` to create the result.
