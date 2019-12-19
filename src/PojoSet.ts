/**
 * Plain-old-javascript-object Set Implementaiton.
 *
 * Values in the set will have a value of `true`.
 */
export type PojoSet<T extends PropertyKey> = {
  readonly [idx in T]?: true;
};

/**
 * Create a a PojoSet from an array of values.
 * @param values values to populate the set with
 * @returns a PojoSet containing the values
 */
function from<T extends PropertyKey>(values: T[]): PojoSet<T> {
  return values.reduce((acc, next) => {
    acc[next] = true;
    return acc;
  }, {} as Record<T, true>);
}

/**
 * Convert a PojoSet to an array of values.
 * @param set A PojoSet
 * @returns an array containing all the values in the set.
 */
function toArray<T extends PropertyKey>(set: PojoSet<T>): T[] {
  const keys = Object.keys(set) as T[];

  // For maximum compatibility, filter on the values, in case the user has set some fields to false manually.
  return keys.filter((k) => has(set, k));
}

/**
 * Create a PojoSet from the values of a Typescript Enum.
 *
 * @param enumObj A typescript `enum` object
 * @returns A PojoSet of the enum values
 */
function fromEnum<T extends Record<string | number, PropertyKey>>(enumObj: T): PojoSet<T[keyof T]> {
  return from(
    Object.keys(enumObj)
      // Filter out numeric value entries from
      // numeric & hybrid TS enums
      .filter(k => isNaN(parseInt(k, 10)))
      .map(k => enumObj[k]),
  );
}

/**
 * Check if an value is in a PojoSet.
 *
 * @param set A PojoSet
 * @param value The value to check existence of
 * @returns true if the value exists in the set, false otherwise.
 */
function has<T extends PropertyKey>(set: PojoSet<T>, value: T): boolean {
  return !!set[value];
}

/**
 * Add an item to a PojoSet, immutably.
 *
 * @param set An existing PojoSet
 * @param value The value to add
 * @returns A new PojoSet contianing the original set and the given value.
 */
function add<T extends PropertyKey, U extends PropertyKey>(set: PojoSet<T>, value: U): PojoSet<T | U> {
  return {
    ...set,
    [value]: true,
  } as PojoSet<T | U>;
}

/**
 * Remove an item from a PojoSet, immutably.
 *
 * @param set An existing PojoSet
 * @param value The value to remove
 * @returns A new PojoSet contianing the original set minus the given value.
 */
function remove<T extends PropertyKey>(set: PojoSet<T>, value: T): PojoSet<T> {
  // Extracting the the value from the PojoSet object via destructuring
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [value]: removed, ...remaining } = set;
  return remaining as PojoSet<T>;
}

/**
 * Conditionally add or remove an item from a PojoSet, immutably.
 *
 * @param set An existing PojoSet
 * @param value The value to toggle
 * @param enable Whether to add or remove the item from the set.
 * @returns A new PojoSet contianing the original set plus or minus the given value.
 */

function toggle<T extends PropertyKey, U extends PropertyKey>(set: PojoSet<T>, value: U, enable: true): PojoSet<T | U>;
function toggle<T extends PropertyKey, U extends PropertyKey>(
  set: PojoSet<T>,
  value: U,
  enable: false,
): U extends T ? PojoSet<T> : never;
function toggle<T extends PropertyKey, U extends PropertyKey>(
  set: PojoSet<T>,
  value: U,
  enable: boolean,
): PojoSet<T> | PojoSet<T | U>;
function toggle<T extends PropertyKey, U extends PropertyKey>(
  set: PojoSet<T>,
  value: U,
  enable: boolean,
): PojoSet<T> | PojoSet<T | U> {
  if (enable) {
    return add(set, value);
  } else {
    // If `U` is not part of `T` this should technically be a No-Op.
    return remove(set, (value as unknown) as T);
  }
}

/**
 * Create an empty PojoSet of the given type.
 *
 * @returns A new, empty PojoSet
 */
function empty<T extends PropertyKey = never>(): PojoSet<T> {
  return {};
}

/**
 * Create a PojoSet from the union of two PojoSets.
 *
 * @param a A PojoSet
 * @param b A PojoSet
 * @returns A new PojoSet containing the values from both input sets.
 */
function union<T extends PropertyKey, U extends PropertyKey>(a: PojoSet<T>, b: PojoSet<U>): PojoSet<T | U> {
  return {
    ...a,
    ...b,
  };
}

/**
 * Create a PojoSet from the set difference of two PojoSets
 *
 * @param a A PojoSet
 * @param b A PojoSet
 * @returns A new PojoSet containing the values from the first set, minus the values shared by both sets.
 */
function difference<T extends PropertyKey, U extends PropertyKey>(a: PojoSet<T>, b: PojoSet<T | U>): PojoSet<T> {
  return from(
    // Remove all items in A that exist in B
    toArray(a).filter(i => !has(b as PojoSet<T | U>, i)),
  );
}

/**
 * Create a PojoSet from the set intersection of two PojoSets
 *
 * @param a A PojoSet
 * @param b A PojoSet
 * @returns A new PojoSet containing only the values that exist in both input sets.
 */
function intersection<T extends PropertyKey, U extends PropertyKey>(a: PojoSet<T>, b: PojoSet<U>): PojoSet<T & U> {
  return from(
    // Only keep items that exist in both A and B
    toArray(a).filter(i => has(b as PojoSet<T | U>, i)),
  );
}

export const PojoSet = {
  add,
  remove,
  toggle,
  has,
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
