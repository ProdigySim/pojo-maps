/* eslint-disable */

import { PojoMap } from '.';

type Opaque<T, U> = T & { __brand: U };
type UserId = Opaque<string, 'userid'>;
type ClientId = Opaque<string, 'clientid'>;

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
  interface User {
    id: UserId;
    name: string;
  }
  const usersById = PojoMap.empty<UserId, User>();
  const userId = '1234' as UserId;
  PojoMap.get(usersById, userId); // $ExpectType User | undefined

  const clientId = '5432' as ClientId;
  // $ExpectError
  PojoMap.get(usersById, clientId);
  // $ExpectError
  PojoMap.get(usersById, '1234');

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

function shouldExtractPickTypes() {
  const ab = PojoMap.empty<'a' | 'b', number>();

  PojoMap.pick(ab, ['a']); // $ExpectType PojoMap<"a", number>
  PojoMap.pick(ab, ['a', 'b']); // $ExpectType PojoMap<"a" | "b", number>
  // $ExpectError
  PojoMap.pick(ab, ['a', 'b', 'c']);

  const str = PojoMap.empty<string, number>();
  PojoMap.pick(str, ['a', 'b', 'c']); // $ExpectType PojoMap<"a" | "b" | "c", number>

  const strnum = PojoMap.empty<string | number, number>();
  PojoMap.pick(strnum, [1, 2, 3]); // $ExpectType PojoMap<1 | 2 | 3, number>
  PojoMap.pick(strnum, [1, 2, 3] as number[]); // $ExpectType PojoMap<number, number>
}

function shouldSelectPickedKeys() {
  const ab = PojoMap.empty<'a' | 'b', number>();

  PojoMap.pick(ab, ['a']); // $ExpectType PojoMap<"a", number>
  PojoMap.pick(ab, ['a', 'b']); // $ExpectType PojoMap<"a" | "b", number>
  // $ExpectError
  PojoMap.pick(ab, ['a', 'b', 'c']);

  const str = PojoMap.empty<string, number>();
  PojoMap.pick(str, ['a', 'b', 'c']); // $ExpectType PojoMap<"a" | "b" | "c", number>

  const strnum = PojoMap.empty<string | number, number>();
  PojoMap.pick(strnum, [1, 2, 3]); // $ExpectType PojoMap<1 | 2 | 3, number>
  PojoMap.pick(strnum, [1, 2, 3] as number[]); // $ExpectType PojoMap<number, number>

  const tinytype = PojoMap.empty<UserId, string>();

  PojoMap.pick(tinytype, ['asdf', 'dsa', 'fsda'] as UserId[]); // $ExpectType PojoMap<Opaque<string, "userid">, string>
}

function shouldExtractOmitTypes() {
  const ab = PojoMap.empty<'a' | 'b', number>();

  PojoMap.omit(ab, ['a']); // $ExpectType PojoMap<"b", number>
  PojoMap.omit(ab, ['a', 'b']); // $ExpectType PojoMap<never, number>
  // $ExpectError
  PojoMap.omit(ab, ['a', 'b', 'c']);

  const str = PojoMap.empty<string, number>();
  PojoMap.omit(str, ['a', 'b', 'c']); // $ExpectType PojoMap<string, number>

  const strnum = PojoMap.empty<string | number, number>();
  PojoMap.omit(strnum, [1, 2, 3]); // $ExpectType PojoMap<string | number, number>
  PojoMap.omit(strnum, [1, 2, 3] as number[]); // $ExpectType PojoMap<string | number, number>

  const tinytype = PojoMap.empty<UserId, string>();

  PojoMap.omit(tinytype, ['asdf', 'dsa', 'fsda'] as UserId[]); // $ExpectType PojoMap<Opaque<string, "userid">, string>
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
