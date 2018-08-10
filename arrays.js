const vals = [1, 2, 3, 4, 5];

vals
  .filter(val => val % 2 === 0)
  .map(val => val + 5)
  .forEach(val => console.log(val));
