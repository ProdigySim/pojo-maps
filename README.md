# POJO Maps

In using React and Redux, you may find that you have to use POJO objects instead of ES6+ native objects like `Set` and `Map`. This project aims to provide a well typed, immutable POJO Map implementation that can simplify tasks you often do with POJO Maps.

See also [`pojo-sets`](https://www.github.com/ProdigySim/pojo-sets)

![CICD Badge](https://travis-ci.com/ProdigySim/pojo-sets.svg?branch=master)

## Quick start

Install the package

```bash
yarn add pojo-maps
```

Import and start using it!

```ts
import { PojoMap } from 'pojo-maps';

const myMap = PojoMap.fromEntries(['a', 1]. ['b', 2]);
```

## Usage

PojoMap are meant to be a drop-in replacement everywhere you use immutable `Partial<Record<T, U>>` structures. Their main benefit is to handle the [ambiguity in Typescript around missing & "undefined" keys](https://github.com/microsoft/TypeScript/issues/13195).

```ts
// Traditional Record types:
declare const items: Partial<Record<string, string>>;

// Lame
Object.values(items); // type: Array<string | undefined>
// Extra lame!!
items['myvalue'] = undefined;

// PojoMap:
declare const map: PojoMap<string, string>;

// Cool!
PojoMap.values(map); // type: Array<string>
// Wow! Error!!!
PojoMap.set(map, 'myvalue', undefined); // Argument of type 'undefined' is not assignable to parameter
```

The traditional record types require a manual type assertion. By using immutable helper methods, PojoMap can do all of the normal record operations in a typesafe manner.

### Advanced Usage

PojoMap contains helper methods to do most common `Object` or `Record` operations.

```ts
const alphaNum = PojoMap.fromEntries([['a', 1], ['b', 2], ['c', 3]] as const);

const abcd = PojoMap.set(alphaNum, 'd', 4);
const abd = PojoMap.remove(abcd, 'c');

PojoMap.keys(abd); // ['a', 'b', 'd']
PojoMap.values(abcd); // [1, 2, 3, 4]
PojoMap.entries(alphaNum); // [['a', 1], ['b', 2], ['c', 3]]

// Add additional types to your map?
const empty = PojoMap.empty<string, string>();
const withNums = PojoMap.set('a', 10);


// Convert a PojoMap into a PojoSet
const set = PojoSet.from(PojoMap.keys(alphaNum));
```
