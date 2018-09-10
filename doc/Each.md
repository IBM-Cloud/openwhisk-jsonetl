### Each

Executes an OpenWhisk Action (or Sequence) on each object of an array. The array is obtained from the input object using a JSONata expression. You can choose to call a Sequence to begin a new pipeline or call and individual Action.

| Input | Description |
| --- | ---  |
| _path: string | The JSONata expression to locate the array from the input object |
| _action: string | The Action or Sequence to invoke |