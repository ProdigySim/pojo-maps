# POJO Sets

In using React and Redux, you may find that you have to use POJO objects instead of ES6+ native objects like `Set` and `Map`. This project aims to provide a well typed, immutable POJO Set implementation that can simplify tasks you often do with POJO sets.

![CICD Badge](https://travis-ci.com/ProdigySim/pojo-sets.svg?branch=master)

## Quick start

Install the package

```bash
yarn add pojo-sets
```

Import and start using it!

```ts
import { PojoSet } from 'pojo-sets';

const mySet = PojoSet.from(['foo', 'bar']);
```

## Usage

PojoSets are meant to be a drop-in replacement everywhere you use immutable `Record<T, boolean>` structures. Their main benefit is when contrustricting these Sets, since you get to avoid manual `[].reduce()` construction.

```ts
// Traditional set construction:
const oldSchool = ['foo', 'bar'].reduce((acc, next) => {
  return {
    ...acc,
    [next]: true,
  };
}, {} as Record<string, boolean>);
// typeof oldSchool: Record<string, boolean>

// With PojoSet helper:
const newHotness = PojoSet.from(['foo', 'bar']);
// typeof newHotness: PojoSet<'foo' | 'bar'>
```

The traditional method requires a manual type assertion, `reduce` has issues inferring types. And, of course, if you want stricter types on your Set, you'd have to build that manually. `PojoSet.from` handles all the type assertions for you.

Since you get stricter types out of the box with `PojoSet`, you get compile time checks for well-defined sets.

```ts
// ERROR! Property 'baz' does not exist on type 'PojoSet<"foo" | "bar">'.(7053)
if(newHotness['baz']) {
  // ...
}
```

For a quick demo, check out this [Typescript Playground](https://www.typescriptlang.org/play/index.html?target=99&ssl=22&ssc=2&pln=20&pc=1#code/PTAEBUCcEMBMEsAu8D2A7aAbUBnApoqAMbo6KQCuRy6AXALABQJaZoKmsAykQBYodQAXlABtAOQAzAeIA0ocQCNokcQF0AdJDywqeABT7oRIvLR4AHogCUwgHygA3k1ChtiCpDROXr0BoDjU19XUXMrNVpQcgo8WV8AXwBuJgT5RwTQaBxQACU8EkhYAB4ySHg0AHN5RQFMPGg0O2sUxhBogE8ABzwUSXZOHn4OKPzCkrKK6tBajgampiZ2gHUkXlAABRQAKxQuAlBePEweyAZmUkJzAHcACRREcxwckUlIFABbfQlpFDkFZSqNQtJZgRDdXr9G73R54Z5RLa7faIYpSGSgAA+AJU4jsizaYA2eEg0kgH2iR1w0A+eGIRyIAGscugZg9eABCJjwfr6DjcPh1H4yNSgABkotA0IeTxwQr+wJ8jFcLBwcw0mBQlX04hQDPEIMYCXxKzWWVw5Hg1EwHU6PVguAI8nAEJwRHKXUIREadIKDKyns+XXg9Wi8BpoGuR0QR0gZq671O4NAlngZBwnMY3NAvMGAo4EmUAC91GKJVLYc8C9BiwrnEriKQ1RqteI0A92Az2frWkbGPjwT1Njs9gRiuBk1Y8GhYDkNgnieCANJ4DoOER11zaODoa1ieCwCygCoQNQAfiiMTwPdakgoaGoqG8b0+Y4niCnM8288gS5Xdn0ABuWCxDgUTgKIwIIsOyJjg4G5uAQnjeEBmAgVoOh6IYQRmJYNj2IqfhZCYYS4SKIiXq0hHuEhRFEJRoBpE4mTZHkBQoEUY7yJezQ9kwt73jQ3i8Nkr64R+s7fr+q76PgiBQUio7gHY8gobEYHWFEsz1N68HUV4oDsuysmiKpeBqD2QA)

### Advanced Usage

For the sake of completeness, this package also contains various immutable Set operations, as well as some nice ways to construct sets from Typescript `enum`s.

Check out our unit tests for complete usage. But, here's a brief overview:

```ts
enum Fruits {
  Apple = 'apple',
  Orange = 'orange',
  Banana = 'banana',
}
const fruits = PojoSet.fromEnum(Fruits);

const fruitsAndVeggies = PojoSet.add(fruits, 'tomato');

const veggies = PojoSet.difference(fruitsAndVeggies, fruits);

expect(PojoSet.union(fruits, veggies)).toEqual(fruitsAndVeggies);

expect(PojoSet.remove(fruitsAndVeggies, 'tomato')).toEqual(fruits);

expect(PojoSet.intersection(fruits, veggies)).toEqual(PojoSet.empty());

// Print all fruits and veggies
console.log(PojoSet.toArray(fruitsAndVeggies).join(', '));
```
