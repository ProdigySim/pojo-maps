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
    expect(PojoMap.empty<string, number>()).toEqual({});
  });

  it('should get a value via its key', () => {
    const map = PojoMap.fromEntries<string | number | symbol, number | boolean | string>([
      ['a', 5],
      [2, 'blue'],
      ['orange', true],
    ]);

    expect(PojoMap.has(map, 'a')).toEqual(true);
    expect(PojoMap.has(map, 2)).toEqual(true);
    expect(PojoMap.has(map, 'orange')).toEqual(true);
  });

  it('should return has() == true even when values are falsy', () => {
    const map = PojoMap.fromEntries<string, number | boolean | string>([
      ['a', 0],
      ['b', false],
      ['c', ''],
    ]);
    expect(PojoMap.has(map, 'a')).toEqual(true);
    expect(PojoMap.has(map, 'b')).toEqual(true);
    expect(PojoMap.has(map, 'c')).toEqual(true);
    });

    it('should add to a PojoMap immutably', () => {
      const map = PojoMap.fromEntries<string, number>([
        ['a', 0],
        ['b', 1],
        ['c', 2],
      ]);
      const largerMap = PojoMap.set(map, 'd', 3);
      expect(largerMap).toEqual({
        a: 0,
        b: 1,
        c: 2,
        d: 3,
      });
    });

    it('should remove from a PojoMap immutably', () => {
      const map = PojoMap.fromEntries<string, number>([
        ['a', 0],
        ['b', 1],
      ]);
      const smallerMap = PojoMap.remove(map, 'b');
      expect(smallerMap).toEqual({
        a: 0,
      });
      expect(PojoMap.has(smallerMap, 'b')).toEqual(false);
    });
});
