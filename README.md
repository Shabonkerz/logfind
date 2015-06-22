

## CLI Usage
1. Add `.logfind` to root of your desired directory. (TODO: Add `logfind init` command.)
2. Whitelist files to search by adding one glob or filename per line to `.logfind`. (TODO: Add `logfind add <file|glob>` command.)
3. Run `logfind <string|regex>` to search the files. (TODO: Change this to `logfind find <string|regex>`.)

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
