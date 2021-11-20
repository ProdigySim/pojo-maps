/* eslint-disable */
import {expectType} from 'tsd';
import { PojoMap } from '../lib';

type Opaque<T, U> = T & { __brand: U };
type UserId = Opaque<string, 'userid'>;
type ClientId = Opaque<string, 'clientid'>;

function shouldNotAllowUndefinedNullValues() {
  // @ts-expect-error
  type UndefMap = PojoMap<string, number | undefined>;
  // @ts-expect-error
  type NullMap = PojoMap<string, number | null>;

  type ABCN = 'a' | 'b' | 'c' | null;
  // @ts-expect-error
  type NullMap2 = PojoMap<string, ABCN>;
}

function shouldGetOptionally() {
  const abc = PojoMap.empty<'a' | 'b' | 'c', number>();
  expectType<number | undefined>(PojoMap.get(abc, 'a'));

  const str = PojoMap.empty<string, number>();
  expectType<number | undefined>(PojoMap.get(str, 'd'));
}

function shouldNotAllowAccessOfInvalidKey() {
  const map = PojoMap.empty<'a' | 'b' | 'c', number>();

  // @ts-expect-error
  PojoMap.get(map, 'd');
  // @ts-expect-error
  PojoMap.has(map, 'd');
}

function shouldNotAllowSettingUndefined() {
  const map = PojoMap.empty<string, string>();

  expectType<string[]>(PojoMap.values(map));
  // @ts-expect-error
  PojoMap.set(map, 'myvalue', undefined);
}

function shouldCombineTypesWithAdd() {
  const ab = PojoMap.fromEntries([
    ['a', 1],
    ['b', 2],
  ]);

  expectType<PojoMap<"a" | "b", number>>(ab);

  expectType<PojoMap<"a" | "b" | "c", number>>(PojoMap.set(ab, 'c', 3));

  const abConst = PojoMap.fromEntries([
    ['a', 1],
    ['b', 2],
  ] as const);

  // TODO: Why does Typescript swap these? Does it
  expectType<PojoMap<"a" | "b", 2 | 1>>(abConst);

  // TODO: Would prefer this:
  // expectType<PojoMap<"a" | "b" | "c", 2 | 1 | 3>>(PojoMap.set(ab, 'c', 3));
  expectType<PojoMap<"a" | "b" | "c", number>>(PojoMap.set(ab, 'c', 3));
}

function shouldGiveGoodTagTypeTypes() {
  interface User {
    id: UserId;
    name: string;
  }
  const usersById = PojoMap.empty<UserId, User>();
  const userId = '1234' as UserId;
  expectType<User | undefined>(PojoMap.get(usersById, userId));

  const clientId = '5432' as ClientId;
  // @ts-expect-error
  PojoMap.get(usersById, clientId);
  // @ts-expect-error
  PojoMap.get(usersById, '1234');

  expectType<Opaque<string, "userid">[]>(PojoMap.keys(usersById));

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
  expectType<PojoMap<Opaque<string, "userid">, User>>(PojoMap.fromEntries(users.map(u => [u.id, u])));
}

function shouldExtractPickTypes() {
  const ab = PojoMap.empty<'a' | 'b', number>();

  expectType<PojoMap<"a", number>>(PojoMap.pick(ab, ['a']));
  expectType<PojoMap<"a" | "b", number>>(PojoMap.pick(ab, ['a', 'b']));
  // @ts-expect-error
  PojoMap.pick(ab, ['a', 'b', 'c']);

  const str = PojoMap.empty<string, number>();
  expectType<PojoMap<"a" | "b" | "c", number>>(PojoMap.pick(str, ['a', 'b', 'c']));

  const strnum = PojoMap.empty<string | number, number>();
  expectType<PojoMap<1 | 2 | 3, number>>(PojoMap.pick(strnum, [1, 2, 3]));
  expectType<PojoMap<number, number>>(PojoMap.pick(strnum, [1, 2, 3] as number[]));
}

function shouldSelectPickedKeys() {
  const ab = PojoMap.empty<'a' | 'b', number>();

  expectType<PojoMap<"a", number>>(PojoMap.pick(ab, ['a']));
  expectType<PojoMap<"a" | "b", number>>(PojoMap.pick(ab, ['a', 'b']));
  // @ts-expect-error
  PojoMap.pick(ab, ['a', 'b', 'c']);

  const str = PojoMap.empty<string, number>();
  expectType<PojoMap<"a" | "b" | "c", number>>(PojoMap.pick(str, ['a', 'b', 'c']));

  const strnum = PojoMap.empty<string | number, number>();
  expectType<PojoMap<1 | 2 | 3, number>>(PojoMap.pick(strnum, [1, 2, 3]));
  expectType<PojoMap<number, number>>(PojoMap.pick(strnum, [1, 2, 3] as number[]));

  const tinytype = PojoMap.empty<UserId, string>();

  expectType<PojoMap<Opaque<string, "userid">, string>>(PojoMap.pick(tinytype, ['asdf', 'dsa', 'fsda'] as UserId[]));
}

function shouldExtractOmitTypes() {
  const ab = PojoMap.empty<'a' | 'b', number>();

  expectType<PojoMap<"b", number>>(PojoMap.omit(ab, ['a']));
  expectType<PojoMap<never, number>>(PojoMap.omit(ab, ['a', 'b']));
  // @ts-expect-error
  PojoMap.omit(ab, ['a', 'b', 'c']);

  const str = PojoMap.empty<string, number>();
  expectType<PojoMap<string, number>>(PojoMap.omit(str, ['a', 'b', 'c']));

  const strnum = PojoMap.empty<string | number, number>();
  expectType<PojoMap<string | number, number>>(PojoMap.omit(strnum, [1, 2, 3]));
  expectType<PojoMap<string | number, number>>(PojoMap.omit(strnum, [1, 2, 3] as number[]));

  const tinytype = PojoMap.empty<UserId, string>();

  expectType<PojoMap<Opaque<string, "userid">, string>>(PojoMap.omit(tinytype, ['asdf', 'dsa', 'fsda'] as UserId[]));
}

function shouldUnionizeMaps() {
  const ab = PojoMap.empty<'a' | 'b', 1 | 2>();
  const cb = PojoMap.empty<'c' | 'd', 3 | 4>();

  expectType<PojoMap<"a" | "b" | "c" | "d", 2 | 1 | 3 | 4>>(PojoMap.union(ab, cb));
  expectType<PojoMap<"a" | "b" | "c" | "d", 2 | 1 | 3 | 4>>(PojoMap.union(cb, ab));

  const ab2 = PojoMap.empty<'a' | 'b', 3 | 4>();

  expectType<PojoMap<"a" | "b", 2 | 1 | 3 | 4>>(PojoMap.union(ab, ab2));
  expectType<PojoMap<"a" | "b", 2 | 1 | 3 | 4>>(PojoMap.union(ab2, ab));

  const sn = PojoMap.empty<string, number>();
  const ns = PojoMap.empty<number, string>();

  expectType<PojoMap<string | number, string | number>>(PojoMap.union(sn, ns));
  expectType<PojoMap<string | number, string | number>>(PojoMap.union(ns, sn));
}
