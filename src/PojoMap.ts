/**
 * Plain-old-javascript-object Map Implementaiton.
 *
 * Only supports non-null, non-undefined value types.
 */
export type PojoMap<T extends PropertyKey, U extends {}> = {
  readonly [idx in T]?: U;
};


/**
 * Create an empty PojoMap of the given type.
 *
 * @returns A new, empty PojoMap
 */
function empty<T extends PropertyKey, U extends {}>(): PojoMap<T, U> {
  return {};
}

export const PojoMap = {
  empty,
};
