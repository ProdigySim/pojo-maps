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

### Project Goals

This project is almost trivial in terms of its JavaScript functionality. The true mission of this project is to improve handling around Record objects in TypeScript. In particular, these two scenarios:

1. https://github.com/microsoft/TypeScript/pull/30796: TypeScript does not distinguish missing/undefined properties.
   * We want to provide consistent, practical types for `get()` and `values()` operations.
   * Standard `Record` or `Partial<Record>` in TS inconsistently give `T | undefined` vs `T` between `rec[key]` and `Object.values(rec)`;
   * Our utility methods for PojoMap provide constraints & type assertions to give more useful types here.
2. https://github.com/microsoft/TypeScript/pull/26797 Tag Types are not allowed as index signature parameter types.
   * DIY Tag Types, aka nominal types or opaque types, are not supported first party in TypeScript.
   * [Unlike opaque types in flow](https://github.com/Microsoft/TypeScript/issues/4895#issuecomment-425132582), our DIY tag types cannot be used as index parameters.
   * Our utility methods for PojoMap provide type assertions to allow "indexing" a PojoMap using a tag type.
  
