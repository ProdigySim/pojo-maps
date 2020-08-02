import { PojoMap } from '../';

// Leibniz equality test to ensure exact type match
// see https://medium.com/codestar-blog/leibniz-equality-in-typescript-2aeff1303749
type Leibniz<A, B> = ((a: A) => B) & ((b: B) => A);
function identity<T>(t: T): T {
  return t;
}
function leibnizTest<T1, T2>(id: Leibniz<T1, T2>): void {
  id((undefined as unknown) as T2);
}

describe('PojoMap', () => {
  it('should make an empty Map', () => {
    expect(PojoMap.empty<string, number>()).toStrictEqual({});
  });

  it('should make a Map from entries', () => {
    expect(
      PojoMap.fromEntries([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]),
    ).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  it('should make a Map from entries with precise types', () => {
    const map = PojoMap.fromEntries([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ] as const);
    leibnizTest<typeof map, PojoMap<'a' | 'b' | 'c', 1 | 2 | 3>>(identity);
  });

  it('should check whether it is defined at a key', () => {
    const map = PojoMap.fromEntries<string | number | symbol, number | boolean | string>([
      ['a', 5],
      [2, 'blue'],
      ['orange', true],
    ]);

    expect(PojoMap.has(map, 'a')).toBe(true);
    expect(PojoMap.has(map, 2)).toBe(true);
    expect(PojoMap.has(map, 'orange')).toBe(true);
  });

  it('should return has() == true even when values are falsy', () => {
    const map = PojoMap.fromEntries<string, number | boolean | string>([
      ['a', 0],
      ['b', false],
      ['c', ''],
    ]);
    expect(PojoMap.has(map, 'a')).toBe(true);
    expect(PojoMap.has(map, 'b')).toBe(true);
    expect(PojoMap.has(map, 'c')).toBe(true);
  });

  it('should get the value at a key', () => {
    const map = PojoMap.fromEntries([
      ['a', 1],
      ['b', 0],
      ['c', -1],
    ]);

    expect(PojoMap.get(map, 'a')).toBe(1);
    expect(PojoMap.get(map, 'b')).toBe(0);
    expect(PojoMap.get(map, 'c')).toBe(-1);

    const res = PojoMap.get(map, 'a');
    leibnizTest<typeof res, number | undefined>(identity);
  });

  it('should return undefined when key is not found', () => {
    const map = PojoMap.fromEntries<string, number>([['a', 1]]);
    expect(PojoMap.get(map, 'd')).toBeUndefined();

    const res = PojoMap.get(map, 'd');
    leibnizTest<typeof res, number | undefined>(identity);
  });

  it('should add to a PojoMap immutably', () => {
    const map = PojoMap.fromEntries<string, number>([
      ['a', 0],
      ['b', 1],
      ['c', 2],
    ]);
    const largerMap = PojoMap.set(map, 'd', 3);
    expect(largerMap).toStrictEqual({
      a: 0,
      b: 1,
      c: 2,
      d: 3,
    });
  });

  it('should overwrite an existing value with the same key', () => {
    const ab = PojoMap.fromEntries<string, number>([
      ['a', 0],
      ['b', 1],
    ]);
    const abc = PojoMap.set(ab, 'b', 5);
    expect(abc).toStrictEqual({
      a: 0,
      b: 5,
    });
  });

  it('should add additional types to a map', () => {
    const ab = PojoMap.fromEntries([
      ['a', 0],
      ['b', 1],
    ]);
    const abc = PojoMap.set(ab, 'c', 5);
    expect(abc).toStrictEqual({
      a: 0,
      b: 1,
      c: 5,
    });

    leibnizTest<typeof abc, PojoMap<'a' | 'b', number>>(identity);
  });

  it('should remove from a PojoMap immutably', () => {
    const map = PojoMap.fromEntries<string, number>([
      ['a', 0],
      ['b', 1],
    ]);
    const smallerMap = PojoMap.remove(map, 'b');
    expect(smallerMap).toStrictEqual({
      a: 0,
    });
    expect(PojoMap.has(smallerMap, 'b')).toStrictEqual(false);
  });

  it("should do nothing when removing a key that doesn't exist", () => {
    const map = PojoMap.fromEntries<string, number>([
      ['a', 0],
      ['b', 1],
    ]);
    const newMap = PojoMap.remove(map, 'c');
    expect(newMap).toStrictEqual({
      a: 0,
      b: 1,
    });
    expect(newMap).toStrictEqual(map);
    expect(Object.is(newMap, map)).toBe(false);
    expect(PojoMap.has(newMap, 'c')).toBe(false);
  });

  it('should return the keys for a PojoMap', () => {
    expect(
      PojoMap.keys(
        PojoMap.fromEntries([
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ]),
      ),
    ).toEqual(['a', 'b', 'c']);
  });

  it('should return the values for a PojoMap', () => {
    expect(
      PojoMap.values(
        PojoMap.fromEntries([
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ]),
      ),
    ).toEqual([1, 2, 3]);
  });

  it('should return the entries for a PojoMap', () => {
    expect(
      PojoMap.entries(
        PojoMap.fromEntries([
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ]),
      ),
    ).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });

  it('should return the correct size of a PojoMap', () => {
    const map = PojoMap.fromEntries<string, number>([
      ['a', 0],
      ['b', 1],
    ]);
    expect(PojoMap.size(map)).toStrictEqual(2);
  });

  it('should map to a new PojoMap via a transform function', () => {
    const map = PojoMap.fromEntries<string, number>([
      ['a', 1],
      ['b', 2],
    ]);
    expect(PojoMap.map(map, (item) => item * 2)).toStrictEqual({
      a: 2,
      b: 4,
    });
    expect(PojoMap.map(map, (item, key) => item+key)).toStrictEqual({
      a: '1a',
      b: '2b',
    });
  });
});
