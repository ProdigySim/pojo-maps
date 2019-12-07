/**
 * Plain-old-javascript-object Set Implementaiton.
 *
 * Items in the set will have a value of `true`.
 */
export type PojoSet<T extends PropertyKey> = {
  readonly [idx in T]?: true;
};

/**
 * Createa a PojoSet from a list of items.
 * @param items items to populate the set with
 */
function from<T extends PropertyKey>(items: T[]): PojoSet<T> {
  return items.reduce((acc, next) => {
    acc[next] = true;
    return acc;
  }, {} as Record<T, true>);
}

function toArray<T extends PropertyKey>(set: PojoSet<T>): T[] {
  return Object.keys(set) as T[];
}

function fromEnum<T extends Record<string | number, PropertyKey>>(enumObj: T): PojoSet<T[keyof T]> {
  return from(
    Object.keys(enumObj)
      // Filter out numeric value entries from
      // numeric & hybrid TS enums
      .filter(k => isNaN(parseInt(k, 10)))
      .map(k => enumObj[k]),
  );
}

function has<T extends PropertyKey>(set: PojoSet<T>, item: T): boolean {
  return !!set[item];
}

function add<T extends PropertyKey, U extends PropertyKey>(set: PojoSet<T>, item: U): PojoSet<T | U> {
  return {
    ...set,
    [item]: true,
  } as PojoSet<T | U>;
}

function remove<T extends PropertyKey>(set: PojoSet<T>, item: T): PojoSet<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [item]: removed, ...remaining } = set;
  return remaining as PojoSet<T>;
}

function empty<T extends PropertyKey>(): PojoSet<T> {
  return {};
}

function union<T extends PropertyKey, U extends PropertyKey>(a: PojoSet<T>, b: PojoSet<U>): PojoSet<T | U> {
  return {
    ...a,
    ...b,
  };
}

function difference<T extends PropertyKey, U extends PropertyKey>(a: PojoSet<T>, b: PojoSet<T | U>): PojoSet<T> {
  return from(
    // Remove all items in A that exist in B
    toArray(a).filter(i => !has(b as PojoSet<T | U>, i)),
  );
}

function intersection<T extends PropertyKey, U extends PropertyKey>(a: PojoSet<T>, b: PojoSet<U>): PojoSet<T & U> {
  return from(
    // Only keep items that exist in both A and B
    toArray(a).filter(i => has(b as PojoSet<T | U>, i)),
  );
}

export const PojoSet = {
  add,
  remove,
  from,
  toArray,
  fromEnum,
  union,
  empty,
  plus: union,
  difference,
  subtract: difference,
  intersection,
};
