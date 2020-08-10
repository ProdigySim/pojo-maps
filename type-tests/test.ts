/* eslint-disable */

import { PojoMap } from '.';

function shouldNotAllowUndefinedNullValues() {
  // $ExpectError
  type UndefMap = PojoMap<string, number | undefined>;
  // $ExpectError
  type NullMap = PojoMap<string, number | null>;

  type ABCN = 'a' | 'b' | 'c' | null;
  // $ExpectError
  type NullMap2 = PojoMap<string, ABCN>;
}
function shouldGetOptionally() {
  const abc = PojoMap.empty<'a' | 'b' | 'c', number>();
  PojoMap.get(abc, 'a'); // $ExpectType number | undefined

  const str = PojoMap.empty<string, number>();
  PojoMap.get(str, 'd'); // $ExpectType number | undefined
}

function shouldNotAllowAccessOfInvalidKey() {
  const map = PojoMap.empty<'a' | 'b' | 'c', number>();

  // $ExpectError
  PojoMap.get(map, 'd');
  // $ExpectError
  PojoMap.has(map, 'd');
}

function shouldNotAllowSettingUndefined() {
  const map = PojoMap.empty<string, string>();

  PojoMap.values(map); // $ExpectType string[]
  // $ExpectError
  PojoMap.set(map, 'myvalue', undefined);
}

function shouldCombineTypesWithAdd() {
  const ab = PojoMap.fromEntries([
    ['a', 1],
    ['b', 2],
  ]);

  ab; // $ExpectType PojoMap<"a" | "b", number>

  PojoMap.set(ab, 'c', 3); // $ExpectType PojoMap<"a" | "b" | "c", number>

  const abConst = PojoMap.fromEntries([
    ['a', 1],
    ['b', 2],
  ] as const);

  // TODO: Why does Typescript swap these? Does it
  abConst; // $ExpectType PojoMap<"a" | "b", 2 | 1>

  // TODO: Would prefer this:
  // PojoMap.set(ab, 'c', 3); // $ExpectType PojoMap<"a" | "b" | "c", 2 | 1 | 3>
  PojoMap.set(ab, 'c', 3); // $ExpectType PojoMap<"a" | "b" | "c", number>
}

function shouldGiveGoodTagTypeTypes() {
  type Opaque<T, U> = T & { __brand: U };
  type UserId = Opaque<string, 'userid'>;
  type User = {
    id: UserId;
    name: string;
  };
  const usersById = PojoMap.empty<UserId, User>();
  const userId = '1234' as UserId;
  PojoMap.get(usersById, userId); // $ExpectType User | undefined

  PojoMap.keys(usersById); // $ExpectType Opaque<string, "userid">[]

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
  PojoMap.fromEntries(users.map(u => [u.id, u])); // $ExpectType PojoMap<Opaque<string, "userid">, User>
}

function shouldUnionizeMaps() {
  const ab = PojoMap.empty<'a' | 'b', 1 | 2>();
  const cb = PojoMap.empty<'c' | 'd', 3 | 4>();

  PojoMap.union(ab, cb); // $ExpectType PojoMap<"a" | "b" | "c" | "d", 2 | 1 | 3 | 4>
  PojoMap.union(cb, ab); // $ExpectType PojoMap<"a" | "b" | "c" | "d", 2 | 1 | 3 | 4>

  const ab2 = PojoMap.empty<'a' | 'b', 3 | 4>();

  PojoMap.union(ab, ab2); // $ExpectType PojoMap<"a" | "b", 2 | 1 | 3 | 4>
  PojoMap.union(ab2, ab); // $ExpectType PojoMap<"a" | "b", 2 | 1 | 3 | 4>

  const sn = PojoMap.empty<string, number>();
  const ns = PojoMap.empty<number, string>();

  PojoMap.union(sn, ns); // $ExpectType PojoMap<string | number, string | number>
  PojoMap.union(ns, sn); // $ExpectType PojoMap<string | number, string | number>
}
