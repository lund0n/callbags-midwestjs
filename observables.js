const { from } = require("rxjs");
const { map, filter, scan } = require("rxjs/operators");

from([1, 2, 3, 4, 5])
  .pipe(
    filter(x => x % 2 === 0),
    map(x => x + 5),
    scan((acc, curr) => acc + curr)
  )
  .forEach(x => console.log(x));
