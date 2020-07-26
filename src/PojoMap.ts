/**
 * Plain-old-javascript-object Map Implementaiton.
 *
 * Only supports non-null, non-undefined value types.
 */
export type PojoMap<T extends PropertyKey, U extends {}> = {
  readonly [idx in T]?: U;
};

function fromEntries<T extends PropertyKey, U extends {}>(
  entries: Readonly<Array<readonly [T, U]>>,
): PojoMap<T, U> {
  const acc: Partial<Record<T, U>> = {};
  for(const [key, value] of entries) {
    acc[key] = value;
  }
  return acc;
}

/**
 * Check if an value is in a PojoMap.
 *
 * @param map A PojoMap
 * @param value The value to check existence of
 * @returns true if the value exists in the set, false otherwise.
 */
function has<T extends PropertyKey, U extends {}>(map: PojoMap<T,U>, key: T): boolean {
  return typeof map[key] !== 'undefined'
  //return !!map[key];
}

/**
 * Add an entry to a PojoMap, immutably.
 *
 * @param inputMap An existing PojoMap
 * @param outputMap The new PojoMap
 * @param key The entry's key
 * @param value The entry's value
 * @returns A new PojoMap contianing the original PojoMap and the new entry.
 */
function set<T extends PropertyKey, U extends {}>(inputMap: PojoMap<T,U>, key: T, value: U): PojoMap<T,U> {
  return {
    ...inputMap,
    [key]: value,
   };
}

/**
 * Remove an item from a PojoMap, immutably.
 *
 * @param map An existing PojoMap
 * @param value The value to remove
 * @returns A new PojoMap contianing the original map minus the given value.
 */
function remove<T extends PropertyKey, U extends {}>(map: PojoMap<T,U>, key: T): PojoMap<T,U> {
  // Extracting the the value from the PojoMap object via destructuring
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: removed, ...remaining } = map;
  return remaining as PojoMap<T,U>;
}

/**
 * Create an empty PojoMap of the given type.
 *
 * @returns A new, empty PojoMap
 */
function empty<T extends PropertyKey, U extends {}>(): PojoMap<T, U> {
  return {};
}

export const PojoMap = {
  fromEntries,
  has,
  set,
  remove,
  empty,
};
