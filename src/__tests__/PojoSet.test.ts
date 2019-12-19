import { PojoSet } from '../index';

// Leibniz equality test to ensure exact type match
// see https://medium.com/codestar-blog/leibniz-equality-in-typescript-2aeff1303749
type Leibniz<A, B> = ((a: A) => B) & ((b: B) => A);
function identity<T>(t: T): T {
  return t;
}
function leibnizTest<T1, T2>(id: Leibniz<T1, T2>): void {
  id((undefined as unknown) as T2);
}

enum MyStringEnum {
  one = 'a',
  two = 'b',
  three = 'c',
}

enum MyNumericEnum {
  one = 1,
  two = 2,
  three = 3,
}

enum MyHybridEnum {
  one = 1,
  two = 2,
  three = 3,
  aye = 'a',
  bee = 'b',
  see = 'c',
}

describe('PojoSet', () => {
  it('should make a set', () => {
    expect(PojoSet.from(['a', 'b', 'c'])).toEqual({
      a: true,
      b: true,
      c: true,
    });
  });

  it('should allow access to values in set', () => {
    const set = PojoSet.from(['a', 'b', 'c']);

    const a = set.a;
    leibnizTest<typeof a, true | undefined>(identity);
    expect(a).toBeTruthy();
  });

  it('should have sound types', () => {
    leibnizTest<PojoSet<'a' | 'b'>, Readonly<Partial<Record<'a' | 'b', true>>>>(identity);
    leibnizTest<PojoSet<string>, Readonly<Partial<Record<string, true>>>>(identity);
    leibnizTest<PojoSet<number>, Readonly<Partial<Record<number, true>>>>(identity);
    leibnizTest<PojoSet<MyHybridEnum>, Readonly<Partial<Record<MyHybridEnum, true>>>>(identity);

    const s = {} as PojoSet<MyStringEnum>;
    const val = s[MyStringEnum.one];
    leibnizTest<typeof val, true | undefined>(identity);
    expect(val).toBeFalsy();
  });

  it('should filter out dupes', () => {
    expect(PojoSet.from(['a', 'b', 'c', 'b'])).toEqual({
      a: true,
      b: true,
      c: true,
    });
  });

  it('should serialize a set', () => {
    expect(PojoSet.toArray(PojoSet.from(['a', 'b', 'c']))).toEqual(['a', 'b', 'c']);
  });

  it('should serialize a set with items manually removed', () => {
    const s = PojoSet.from(['a', 'b', 'c']);
    const ss = ({
      ...s,
      c: false,
    } as unknown) as PojoSet<'a' | 'b' | 'c'>;

    const out = PojoSet.toArray(ss);
    leibnizTest<typeof out, Array<'a' | 'b' | 'c'>>(identity);
    expect(out).toEqual(['a', 'b']);
  });

  it('should make a set from a string enum', () => {
    const res = PojoSet.fromEnum(MyStringEnum);
    leibnizTest<typeof res, PojoSet<MyStringEnum>>(identity);

    const s = PojoSet.fromEnum(MyStringEnum);
    expect(s).toEqual({
      a: true,
      b: true,
      c: true,
    });
    expect(s[MyStringEnum.one]).toEqual(true);
    expect(s[MyStringEnum.two]).toEqual(true);
    expect(s[MyStringEnum.three]).toEqual(true);
  });

  it('should make a set from a numeric enum', () => {
    const res = PojoSet.fromEnum(MyNumericEnum);

    leibnizTest<typeof res, PojoSet<MyNumericEnum>>(identity);
    expect(res).toEqual({
      1: true,
      2: true,
      3: true,
    });
  });

  it('should make a set from a hybrid enum', () => {
    const res = PojoSet.fromEnum(MyHybridEnum);

    leibnizTest<typeof res, PojoSet<MyHybridEnum>>(identity);
    expect(res).toEqual({
      1: true,
      2: true,
      3: true,
      a: true,
      b: true,
      c: true,
    });
  });

  it('should add to a set immutably', () => {
    const s = PojoSet.from(['a', 'b', 'c']);
    const ss = PojoSet.add(s, 'd');
    expect(ss).toEqual({
      a: true,
      b: true,
      c: true,
      d: true,
    });
    expect(s).toEqual({
      a: true,
      b: true,
      c: true,
    });
  });
  it('should add to a set immutably via toggle', () => {
    const s = PojoSet.from(['a', 'b', 'c']);
    const ss = PojoSet.toggle(s, 'd', true);
    leibnizTest<typeof ss, PojoSet<'a' | 'b' | 'c' | 'd'>>(identity);
    expect(ss).toEqual({
      a: true,
      b: true,
      c: true,
      d: true,
    });
    expect(s).toEqual({
      a: true,
      b: true,
      c: true,
    });
  });

  it('should remove from a set immutably', () => {
    const s = PojoSet.from(['a', 'b', 'c']);
    const ss = PojoSet.remove(s, 'c');
    expect(ss).toEqual({
      a: true,
      b: true,
    });
    expect(s).toEqual({
      a: true,
      b: true,
      c: true,
    });
  });

  it('should remove from a set immutably via toggle', () => {
    const s = PojoSet.from(['a', 'b', 'c']);
    const ss = PojoSet.toggle(s, 'c', false);
    expect(ss).toEqual({
      a: true,
      b: true,
    });
    expect(s).toEqual({
      a: true,
      b: true,
      c: true,
    });
  });

  it('should produce good types when toggling via boolean', () => {
    const s = PojoSet.from(['a', 'b', 'c']);
    const ss = PojoSet.toggle(s, 'c', (false as unknown) as boolean);
    leibnizTest<typeof ss, PojoSet<'a' | 'b' | 'c'>>(identity);

    const sss = PojoSet.toggle(s, 'd', (false as unknown) as boolean);
    leibnizTest<typeof sss, PojoSet<'a' | 'b' | 'c'> | PojoSet<'a' | 'b' | 'c' | 'd'>>(identity);

    const ssss = PojoSet.toggle(s, 'd', (true as unknown) as boolean);
    leibnizTest<typeof ssss, PojoSet<'a' | 'b' | 'c'> | PojoSet<'a' | 'b' | 'c' | 'd'>>(identity);
  });

  it('should create an empty set', () => {
    const s = PojoSet.empty<'a' | 'b'>();
    leibnizTest<typeof s, PojoSet<'a' | 'b'>>(identity);
    const ss = PojoSet.empty<number>();
    leibnizTest<typeof ss, PojoSet<number>>(identity);

    const defaultEmptySet = PojoSet.empty();
    leibnizTest<typeof defaultEmptySet, PojoSet<never>>(identity);
  });

  it('should do a set union', () => {
    const a = PojoSet.from(['a', 'b', 'c']);
    const b = PojoSet.from(['b', 'c', 'd', 'e']);

    const ab = PojoSet.union(a, b);
    const ba = PojoSet.plus(b, a);

    leibnizTest<typeof ab, typeof ba>(identity);
    leibnizTest<typeof ab, PojoSet<'a' | 'b' | 'c' | 'd' | 'e'>>(identity);

    expect(ab).toEqual(ba);
    expect(ab).toEqual({
      a: true,
      b: true,
      c: true,
      d: true,
      e: true,
    });
  });

  it('should do a set union with enums', () => {
    const a = PojoSet.fromEnum(MyStringEnum);
    const b = PojoSet.fromEnum(MyNumericEnum);

    const ab = PojoSet.union(a, b);
    const ba = PojoSet.plus(b, a);

    leibnizTest<typeof ab, typeof ba>(identity);
    leibnizTest<typeof ab, PojoSet<MyStringEnum | MyNumericEnum>>(identity);
    // I'm almost surprised this works but not terribly surprised!
    leibnizTest<typeof ab, PojoSet<MyHybridEnum>>(identity);

    expect(ab).toEqual(ba);
    expect(ab).toEqual({
      a: true,
      b: true,
      c: true,
      1: true,
      2: true,
      3: true,
    });
  });

  it('should do a set difference', () => {
    const a = PojoSet.from(['a', 'b', 'c']);
    const b = PojoSet.from(['b', 'c', 'd', 'e']);

    const aLessB = PojoSet.difference(a, b);
    const bLessA = PojoSet.subtract(b, a);

    leibnizTest<typeof aLessB, PojoSet<'a'>>(identity);
    leibnizTest<typeof bLessA, PojoSet<'d' | 'e'>>(identity);

    expect(aLessB).not.toEqual(bLessA);
    expect(aLessB).toEqual({
      a: true,
    });
    expect(bLessA).toEqual({
      d: true,
      e: true,
    });
  });

  it('should do a set difference with enums', () => {
    const a = PojoSet.fromEnum(MyStringEnum);
    const b = PojoSet.fromEnum(MyNumericEnum);

    const aLessB = PojoSet.difference(a, b);
    const bLessA = PojoSet.subtract(b, a);

    leibnizTest<typeof aLessB, PojoSet<MyStringEnum>>(identity);
    leibnizTest<typeof aLessB, PojoSet<Exclude<MyStringEnum, MyNumericEnum>>>(identity);
    leibnizTest<typeof bLessA, PojoSet<MyNumericEnum>>(identity);
    leibnizTest<typeof bLessA, PojoSet<Exclude<MyNumericEnum, MyStringEnum>>>(identity);

    expect(aLessB).not.toEqual(bLessA);
    expect(aLessB).toEqual(a);
    expect(bLessA).toEqual(b);
  });

  it('should do a set difference with hybrid enums', () => {
    const a = PojoSet.fromEnum(MyHybridEnum);
    const b = PojoSet.fromEnum(MyStringEnum);
    const c = PojoSet.fromEnum(MyNumericEnum);

    const hybridLessStrings = PojoSet.difference(a, b);
    const stringsLessHybrid = PojoSet.subtract(b, a);

    leibnizTest<typeof hybridLessStrings, PojoSet<MyNumericEnum>>(identity);
    leibnizTest<typeof hybridLessStrings, PojoSet<Exclude<MyHybridEnum, MyStringEnum>>>(identity);
    leibnizTest<typeof stringsLessHybrid, PojoSet<never>>(identity);
    leibnizTest<typeof stringsLessHybrid, PojoSet<Exclude<MyStringEnum, MyHybridEnum>>>(identity);

    expect(hybridLessStrings).not.toEqual(stringsLessHybrid);
    expect(hybridLessStrings).not.toEqual(a);
    expect(hybridLessStrings).not.toEqual(b);
    expect(hybridLessStrings).toEqual(c);

    expect(stringsLessHybrid).not.toEqual(a);
    expect(stringsLessHybrid).not.toEqual(b);
    expect(stringsLessHybrid).not.toEqual(c);
    expect(stringsLessHybrid).toEqual({});
  });

  it('should do set intersections', () => {
    const a = PojoSet.from<number>([1, 2, 3, 4, 5]);
    const b = PojoSet.from<number>([9, 8, 7, 6, 5, 4]);

    const mathematicalIntersection = PojoSet.difference(
      a,
      PojoSet.union(PojoSet.difference(a, b), PojoSet.difference(b, a)),
    );

    const res = PojoSet.intersection(a, b);
    leibnizTest<typeof res, PojoSet<4 | 5>>(identity);

    expect(res).toEqual(mathematicalIntersection);
    expect(res).toEqual(PojoSet.intersection(b, a));
  });
});
