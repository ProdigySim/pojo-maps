/**
 * Plain-old-javascript-object Map Implementaiton.
 *
 * Only supports non-null, non-undefined value types.
 */
export type PojoMap<T extends PropertyKey, U extends {}> = {
  readonly [idx in T]?: U;
};

/**
 * Create a PojoMap from a set of key-value pairs.
 * @param entries Key value pairs for creating the map.
 */
function fromEntries<T extends PropertyKey, U extends {}>(entries: Readonly<Array<readonly [T, U]>>): PojoMap<T, U> {
  const acc: Partial<Record<T, U>> = {};
  for (const [key, value] of entries) {
    acc[key] = value;
  }
  return acc;
}

/**
 * Check if a key is in a PojoMap.
 *
 * @param map A PojoMap
 * @param key The key to check existence of
 * @returns true if the key exists in the PojoMap, false otherwise.
 */
function has<T extends PropertyKey, U extends {}>(map: PojoMap<T, U>, key: T): boolean {
  return typeof map[key] !== 'undefined';
}

/**
 * Add an entry to a PojoMap, immutably.
 *
 * @param map An existing PojoMap
 * @param key The entry's key
 * @param value The entry's value
 * @returns A new PojoMap contianing the original PojoMap and the new entry.
 */
function set<T extends PropertyKey, U extends {}>(map: PojoMap<T, U>, key: T, value: U): PojoMap<T, U> {
  return {
    ...map,
    [key]: value,
  };
}

/**
 * Remove an item from a PojoMap, immutably.
 *
 * @param map An existing PojoMap
 * @param key The key to remove
 * @returns A new PojoMap contianing the original map minus the given key.
 */
function remove<T extends PropertyKey, U extends {}>(map: PojoMap<T, U>, key: T): PojoMap<T, U> {
  // Extracting the the key from the PojoMap object via destructuring
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: removed, ...remaining } = map;
  return remaining as PojoMap<T, U>;
}

/**
 * Create an empty PojoMap of the given type.
 *
 * @returns A new, empty PojoMap
 */
function empty<T extends PropertyKey, U extends {}>(): PojoMap<T, U> {
  return {};
}

/**
 * Get the keys defined in this PojoMap.
 * @param map A PojoMap
 * @returns an array containing all the keys where the map is defined.
 */
function keys<T extends PropertyKey, U extends {}>(map: PojoMap<T, U>): T[] {
  const keys = Object.keys(map) as T[];

  // For maximum compatibility, filter on the values, in case the user has set some fields to false manually.
  return keys.filter(k => has(map, k));
}

/**
 * Get all the values in this PojoMap.
 * @param map A PojoMap
 * @returns an array containing all the values where the map is defined.
 */
function values<T extends PropertyKey, U extends {}>(map: PojoMap<T, U>): U[] {
  // Assert that each value is defined, since keys() already filters this.
  return keys(map).map(k => map[k] as U);
}

/**
 * Get all the entries in this PojoMap.
 * @param map A PojoMap
 * @returns an array containing all the key-value pairs where the map is defined.
 */
function entries<T extends PropertyKey, U extends {}>(map: PojoMap<T, U>): [T, U][] {
  // Assert that each value is defined, since keys() already filters this.
  return keys(map).map(k => [k, map[k] as U]);
}

export const PojoMap = {
  fromEntries,
  has,
  set,
  remove,
  empty,
  keys,
  values,
  entries,
};
