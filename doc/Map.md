### Map

Maps values to a new name. For example, you might map `id` to `accountId`. This is useful when the next Request body in the sequence expects the input to have a different property name than what the upstream sequence provided. Note that it does not delete older properties, it only adds new properties. To remove properties, consider using `Pick` next in the Sequence.

| Input | Description |
| --- | ---  |
| _keys: string | A comma separated list of property names to create |
| _jsonatas: string | A semicolon separated list of JSONata expressions to evaluate and assign to similarly indexed `keys` |