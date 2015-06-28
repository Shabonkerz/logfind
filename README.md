

## CLI Usage
1. Clone repository.
2. Run `npm link`
3. Run `logfind init`.
4. Add files to search using `logfind add <file|glob>`
5. Run `logfind find <string|regex>` to search the files.

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
