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
 * Create a PojoMap from a list of items, indexed by a key selector
 * When there are repeat keys, the last item with the given key will be stored.
 * @param items List of items to index
 * @param keySelector A function that will return the index key for an item.
 * @returns A new PojoMap contiaining the indexed items
 */
function fromIndexing<T extends PropertyKey, U extends {}>(
  items: readonly U[],
  keySelector: (item: U, index: number) => T,
): PojoMap<T, U> {
  const acc: Partial<Record<T, U>> = {};
  let i = 0;
  for (const item of items) {
    const key = keySelector(item, i++);
    acc[key] = item;
  }
  return acc;
}

/**
 * Create a PojoMap from a list of items, grouped by a key selector
 * @param items List of items to group
 * @param keySelector A function that will return the index key for an item.
 * @returns A new PojoMap contiaining the grouped items
 */
function fromGrouping<T extends PropertyKey, U extends {}>(
  items: readonly U[],
  keySelector: (item: U, index: number) => T,
): PojoMap<T, U[]> {
  const acc: Partial<Record<T, U[]>> = {};
  let i = 0;
  for (const item of items) {
    const key = keySelector(item, i++);
    let arr = acc[key];
    if (!arr) {
      acc[key] = arr = [];
    }
    arr.push(item);
  }
  return acc;
}

/**
 * Create a PojoMap from a list of items counts, grouped by a key selector
 * @param items List of items to group
 * @param keySelector A function that will return the index key for an item.
 * @returns A new PojoMap contiaining the counts of items by group
 */
function fromCounting<T extends PropertyKey, U extends {}>(
  items: readonly U[],
  keySelector: (item: U, index: number) => T,
): PojoMap<T, number> {
  const acc: Partial<Record<T, number>> = {};
  let i = 0;
  for (const item of items) {
    const key = keySelector(item, i++);
    const count = acc[key] ?? 0;
    acc[key] = count + 1;
  }
  return acc;
}

/**
 * Get the value stored at a given key in a PojoMap.
 *
 * @param map A PojoMap
 * @param key The key to retrieve the value at
 * @returns The value at the key, or undefined.
 */
function get<T extends PropertyKey, U extends {}>(map: PojoMap<T, U>, key: T): U | undefined {
  return map[key];
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
 * @returns A new PojoMap containing the original PojoMap and the new entry.
 */
function set<T extends PropertyKey, T2 extends PropertyKey, U extends {}, U2 extends {}>(
  map: PojoMap<T, U>,
  key: T2,
  value: U2,
): PojoMap<T | T2, U | U2> {
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

/**
 * Get a PojoMap's size (i.e. number of contained values)
 *
 * @param map A PojoMap
 * @returns the number of values contained in a PojoMap
 */
function size<T extends PropertyKey, U extends {}>(map: PojoMap<T, U>): number {
  return keys(map).length;
}

/**
 * Pick a subset of a PojoMap given a list of keys.
 *
 * @param map A PojoMap
 * @param keys The keys to pick from the PojoMap
 * @returns A copy of the input PojoMap containing only the keys specified
 */
function pick<T extends PropertyKey, T2 extends T, U extends {}>(
  map: PojoMap<T, U>,
  keys: readonly T2[],
): PojoMap<T2, U> {
  const keyset = new Set<T>(keys);
  return fromEntries(entries(map).filter(([key]) => keyset.has(key)));
}

// For "omit" we need to filter the keys of the PojoMap, i.e. `T`
// If T is 'a' | 'b', and we omit 'b', we want to transform T to just 'a'
// However, if T is string, and we want to omit some strings, we need to leave T as is.
// Furthermore, this solution needs to be compatible with Tag Types.

/**
 * Given a tag type, get the primitive type this tag type indicates.
 */
type GetTagPrimitive<T extends object> = T extends string
  ? string
  : T extends number
  ? number
  : T extends symbol
  ? symbol
  : T extends boolean
  ? boolean
  : never;
/**
 * Given a primitive type T, if it is a literal type, return T, otherwise never.
 */
type ExcludeFullPrimitives<T extends PropertyKey> = string extends T
  ? never
  : number extends T
  ? never
  : symbol extends T
  ? never
  : T;
/**
 * Filter down type T to only primitive literal types.
 * e.g. 'a' | 'b' => 'a' | 'b'
 * e.g. string    => never
 * e.g. UserId    => never
 * e.g. StrEnum   => StrEnum
 */
type OnlyClosedPrimitives<T extends PropertyKey> = T extends object ? GetTagPrimitive<T> : ExcludeFullPrimitives<T>;

/**
 * Pick a subset of a PojoMap by excluding a list of keys.
 *
 * @param map A PojoMap
 * @param keys The keys to exclude from the PojoMap
 * @returns A copy of the input map with the given keys omitted
 */
function omit<T extends PropertyKey, T2 extends T, U extends {}>(
  map: PojoMap<T, U>,
  keys: readonly T2[],
): PojoMap<Exclude<T, OnlyClosedPrimitives<T2>>, U> {
  const keyset = new Set<T>(keys);
  return fromEntries(entries(map).filter(([key]) => !keyset.has(key)));
}

/**
 * Create a new PojoMap based on a supplied transformation function
 *
 * @param map A PojoMap
 * @param transform The function by which to transform the PojoMap's values
 * @returns a new PojoMap, its values transformed as defined by the transform function
 */
function map<T extends PropertyKey, U extends {}, V extends {}>(
  map: PojoMap<T, U>,
  transform: (item: U, key: T) => V,
): PojoMap<T, V> {
  const originalEntries = entries(map);
  const newEntries = originalEntries.map(([key, value]) => [key, transform(value, key)] as const);
  return fromEntries(newEntries);
}

/**
 * Create a new PojoMap by combining two existing PojoMaps.
 * If there are duplicate keys, the value from the second map will be used.
 *
 * @param baseMap The base map to copy.
 * @param additionalMap An additional map to copy entries from. This map's values will have precedence in the result.
 * @returns A new map containing keys & values from both input maps.
 */
function union<T extends PropertyKey, T2 extends PropertyKey, U extends {}, U2 extends {}>(
  baseMap: PojoMap<T, U>,
  additionalMap: PojoMap<T2, U2>,
): PojoMap<T | T2, U | U2> {
  return fromEntries<T | T2, U | U2>([...entries(baseMap), ...entries(additionalMap)]);
}

export const PojoMap = {
  fromEntries,
  fromIndexing,
  fromGrouping,
  fromCounting,
  get,
  has,
  set,
  remove,
  empty,
  keys,
  values,
  entries,
  size,
  pick,
  omit,
  map,
  union,
};
