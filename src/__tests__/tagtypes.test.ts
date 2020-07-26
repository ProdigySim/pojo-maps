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

type Opaque<T, U> = T & { __brand: U };
type UserId = Opaque<string, 'userid'>;
type User = {
  id: UserId;
  name: string;
};

describe('PojoMap', () => {
  it('should support tag types when building an empty map', () => {
    const usersById = PojoMap.empty<UserId, User>();
    const userId = '1234' as UserId;
    const res = PojoMap.get(usersById, userId);

    leibnizTest<typeof res, User | undefined>(identity);
    expect(res).toBeUndefined();

    const keys = PojoMap.keys(usersById);
    leibnizTest<typeof keys, UserId[]>(identity);
    expect(keys).toEqual([]);
  });

  it('should support tag types when creating a map from entries', () => {
    const users: User[] = [
      {
        id: '1' as UserId,
        name: 'alice',
      },
      {
        id: '2' as UserId,
        name: 'bob',
      },
    ];
    const usersById = PojoMap.fromEntries(users.map(u => [u.id, u]));
    const res = PojoMap.get(usersById, '1' as UserId);

    leibnizTest<typeof res, User | undefined>(identity);
    expect(res).toEqual({ id: '1', name: 'alice' });

    const keys = PojoMap.keys(usersById);
    leibnizTest<typeof keys, UserId[]>(identity);
    expect(keys).toEqual(['1', '2']);
  });
});
