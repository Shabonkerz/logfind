

## CLI Usage
1. Run `logfind init`.
2. Add files to search using `logfind add <file|glob>`
3. Run `logfind find <string|regex>` to search the files.

## Module Usage
```js
...
var logfind = require('logfind');
var logfinder = new LogFind();

// 'OR' mode disabled(default).
var options = {o: false};
var search = '^rickshaw$';
var foundFiles = logfinder.find(options, search);
...
```

## License

MIT © [Asa Rudick]()
