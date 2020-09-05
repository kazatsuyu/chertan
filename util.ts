export type First<Str extends string, Expects extends string> = Str extends `${infer T}${RemoveFirst<Str, Expects>}` ? T : never;
export type Last<Str extends string, Expects extends string> = Str extends `${RemoveLast<Str, Expects>}${infer T}` ? T : never;
export type RemoveFirst<Str extends string, Expects extends string> = Str extends `${Expects}${infer T}` ? T : never;
export type RemoveLast<Str extends string, Expects extends string> = Str extends `${infer T}${Expects}` ? T : never;

export type Extends<T, U> = (T extends U ? 1 : 0) extends 1 ? true : false;
export type Eq<T, U> = And<[Extends<T, U>, Extends<U, T>]>;
export type And<T extends boolean[]> = Extends<T[number], true>;
export type Or<T extends boolean[]> = Not<Extends<T[number], false>>;
export type Not<T extends boolean> = boolean extends T ? Extends<T, false> : never;

export type Assert<_ extends true> = never;
export type AssertNot<_ extends false> = never;

type _Str = 'abc';
type _Chars = 'a' | 'b' | 'c';

//@ts-ignore
interface _Test {
  assert: Assert<true>;
  assertNot: AssertNot<false>;

  extends: {
    ok: Assert<Extends<0, number>>;
    fail: AssertNot<Extends<number, 0>>;
  }
  eq: {
    ok: Assert<Eq<0, 0>>;
    fail: AssertNot<Eq<0, 1>>;
  }
  and: {
    ok: Assert<And<[true, true]>>;
    fail: AssertNot<And<[true, false]>>;
  }
  or: {
    ok: Assert<Or<[true, false]>>;
    fail: AssertNot<Or<[false, false]>>;
  }
  not: {
    ok: Assert<Not<false>>;
    fail: AssertNot<Not<true>>;
  }

  first: Assert<Eq<First<_Str, _Chars>, 'a'>>;
  last: Assert<Eq<Last<_Str, _Chars>, 'c'>>;
  removeFirst: Assert<Eq<RemoveFirst<_Str, _Chars>, 'bc'>>;
  removeLast: Assert<Eq<RemoveLast<_Str, _Chars>, 'ab'>>;
  unexpected: Assert<Eq<First<_Str, 'b'>, never>>;
}
