
/**
 * Get value
 * Given an object or array — the function will return the value at specified path, otherwise null.
 */
const getValue = (obj, path) => path
    .replace(/\[([^[\]]*)]/g, '.$1.')
    .split('.')
    .filter(prop => prop !== '')
    .reduce((prev, next) => (
        prev instanceof Object ? prev[next] : undefined
    ), obj);

getValue({ a: { b: { c: 'd' } } }, 'a.b.c'); // = d
getValue({ a: { b: { c: [1, 2] } } }, 'a.b.c[1]'); // = 2

/**
 * Clamp
 * Ensure a value is within a specified range, otherwise “clamp” to the closest of the minimum and maximum value.
 */
const clamp = (min, max, value) => {
  if (min > max) throw new Error('min cannot be greater than max');
  return value < min
    ? min
    : value > max
      ? max
      : value;
}

clamp(0, 10, -5); // = 0
clamp(0, 10, 20); // = 10
/** Sleep
 * Wait the specified duration in milliseconds before performing the next operation.
 */
const sleep = async (duration) => (
  new Promise(resolve =>
    setTimeout(resolve, duration)
  )
);

await sleep(1000); // waits 1 sec

/**
 *  Group by
 *  Group and index related items in an object according to the keying-function.
 */
const groupBy = (fn, list) => (
  list.reduce((prev, next) => ({
    ...prev,
    [fn(next)]: [...(prev[fn(next)] || []), next]
  }), {})
);

groupBy(vehicle => vehicle.make, [
  { make: 'tesla', model: '3' },
  { make: 'tesla', model: 'y' },
  { make: 'ford', model: 'mach-e' },
]);

// { 
//   tesla: [ { make: 'tesla', ... }, { make: 'tesla', ... } ],
//   ford: [ { make: 'ford', ... } ],
// }

/**
 *  Collect By
 *  Create sub-lists containing related items according to the keying-function.
 */
 import groupBy from './groupBy';

const collectBy = (fn, list) => 
   Object.values(groupBy(fn, list));
 
 collectBy(vehicle => vehicle.make, [
   { make: 'tesla', model: '3' },
   { make: 'tesla', model: 'y' },
   { make: 'ford', model: 'mach-e' },
 ]);
 
 // [ 
 //   [ { make: 'tesla', ... }, { make: 'tesla', ... } ],
 //   [ { make: 'ford', ... } ],
 // ]

/**
 *  Head
 *  Get the first element of a list. This function is useful for writing clean and readable code.
 */
const head = list => list[0];

 head([1, 2, 3]); // = 1
 head([]); // = undefined

/**
 *  Tail
 *  Get all but the first element of a list. This function is useful for writing clean and readable code.
 */
const tail = list => list.slice(1);

 tail([1, 2, 3]); // = [2, 3]
 tail([]); // = []

/**
 *  Flatten
 *  Create a flat list by pulling all items from nested sub-lists recursively.
 */
const flatten = list => list.reduce((prev, next) => ([
  ...prev,
  ...(Array.isArray(next) ? flatten(next) : [next])
]), []);

flatten([[1, 2, [3, 4], 5, [6, [7, 8]]]]); // = [1, 2, 3, 4, 5, 6, 7, 8]

/**
 *  Intersection By
 *  Find all values that are present in both lists as defined by a keying-function.
 */
const intersectionBy = (fn, listA, listB) => {
const b = new Set(listB.map(fn));
  return listA.filter(val => b.has(fn(val)));
};

intersectionBy(v => v, [1, 2, 3], [2, 3, 4]); // = [2, 3]
intersectionBy(v => v.a, [{ a: 1 }, { a: 2 }], [{ a: 2}, { a: 3 }, { a: 4 }]); // = [{ a: 2 }];

/**
 *  Index By
 *  Index each element in a list by a value determined by the keying-function.
 */
const indexBy = (fn, list) =>
 list.reduce((prev, next) => ({
   ...prev,
   [fn(next)]: next
 }), {});
             
indexBy(val => val.a, [{ a: 1 }, { a: 2 }, { a: 3 }]); 
// = { 1: { a: 1 }, 2: { a:2 }, 3: { a: 3 } }

/**
 *  Difference By
 *  Find all items in the first list that are not present in the second list — determined by the keying-function.
 */
const differenceBy = (fn, listA, listB) => {
  const bIndex = indexBy(fn, listb);
   return listA.filter(val => !bIndex[fn(val)]);
 });
 
 differenceBy(val => val, [1,2,3], [3,4,5]); // = [1,2]
 differenceBy(
   vehicle => vehicle.make, 
   [{ make: 'tesla' }, { make: 'ford' }, { make: 'gm' }], 
   [{ make: 'tesla' }, { make: 'bmw' }, { make: 'audi' }], 
 ); // = [{ make: 'ford' }, { make: 'gm' }]

/**
 *  Recover With
 *  Return the default value if the given function throws an Error.
 */
const recoverWith = async (defaultValue, fn, ...args) => {
  try {
  const result = await fn(...args);
    return result;
  } catch (_e) {
    return defaultValue;
  }
}

recoverWith('A', val => val, 'B'); // = B
recoverWith('A', () => { throw new Error() }); // = 'A'

/**
 *  Distance
 *  Calculate the Euclidean distance between two points p1 & p2.
 */
const distance = ([x0, y0], [x1, y1]) => (
  Math.hypot(x1 - x0, y1 - y0)
);

distance([0, 1], [5, 4]); // = 5.8309518948453

/**
 *  Drop While
 *  Drops elements from the list, beginning at the first element, until som predicate is met.
 */
const dropWhile = (pred, list) => {
  let index = 0;
  list.every(elem => {
    index++;
    return pred(elem);
  });
  return list.slice(index-1);
}

dropWhile(val => (val < 5), [1,2,3,4,5,6,7]); // = [5,6,7]

/**
 *  Sum By
 *  Calculate the sum of all elements in a list given some function that produce the individual value of each element.
 */
const sumBy = (fn, list) =>
list.reduce((prev, next) => prev + fn(next), 0);

sumBy(product => product.price, [
 { name: 'pizza', price: 10 }, 
 { name: 'pepsi', price: 5 },
 { name: 'salad', price: 5 },
]); // = 20

/**
 *  Ascending
 *  Creates a ascending comparator-function given a valuating function.
 */
const ascending = (fn) => (a, b) => {
  const valA = fn(a);
  const valB = fn(b);
  return valA < valB ? -1 : valA > valB ? 1 : 0;
}

const byPrice = ascending(val => val.price);
[{ price: 300 }, { price: 100 }, { price: 200 }].sort(byPrice); 
// = [{ price: 100 }, { price: 200 }, { price: 300 }]

/**
 *  Descending
 *  Creates a descending comparator-function given a valuating function.
 */
const descending = (fn) => (a, b) => {
  const valA = fn(b);
  const valB = fn(a);
  return valA < valB ? -1 : valA > valB ? 1 : 0;
}

const byPrice = descending(val => val.price);
[{ price: 300 }, { price: 100 }, { price: 200 }].sort(byPrice); 
// = [{ price: 300 }, { price: 200 }, { price: 100 }]


/**
 *  Find Key
 *  Find the first key within an index that satisfies the given predicate.
 */
const findKey = (predicate, index) => Object
 .keys(index)
 .find(key => predicate(index[key], key, index));

findKey(
 car => !car.available,
 {
   tesla: { available: true },
   ford: { available: false },
   gm: { available: true }
 },
); // = "ford"

/**
 *  Bifurcate By
 *  Split the values of a given list into two lists, one containing values the predicate function evaluates to truthy, the other list containing the falsy.
 */
const bifurcateBy = (predicate, list) =>
 list.reduce((acc, val, i) => (
   acc[predicate(val, i) ? 0 : 1].push(val), acc), 
   [[], []]
 );
 
bifurcateBy(val => val > 0, [-1, 2, -3, 4]); 
// = [[2, 4], [-1, -3]]

/**
 *  Pipe
 *  Perform left-to-right function composition. All extra arguments will be passed to the first function in the list, thus can have any arity. The result will be passed on the second, and the result of the second will be passed to third,… and so on until all functions have been processed.
 */
const pipe = (functions, ...args) => (
  functions.reduce(
    (prev, next) => Array.isArray(prev) ? next(...prev) : next(prev),
    args
  )
);
pipe([Math.abs, Math.floor, val => -val], 4.20); // = -4
pipe([(a, b) => a - b, Math.abs], 5, 10); // = 5
