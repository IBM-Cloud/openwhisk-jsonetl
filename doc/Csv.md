### Csv

Converts a JSON object to CSV.

| Input | Description |
| --- | ---  |
| _titles: string | A comma separated list of titles for the first row |
| _fields: string | A comma separated list JSONata expressions to locate the value |
| _path?: string | The JSONata expression to locate the array of objects that will become rows in the CSV |
| _delim?: string | The delimiter between values |
| _retain?: string | A list of input properties to include in the output |

| Output | Description |
| --- | ---  |
| _data: string | The CSV string will be assigned to the `_data` property and wrapped as an object |