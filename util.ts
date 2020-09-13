import { Digits, DigitsStr } from './numeric';

module detail {
  export declare const every: unique symbol;
  export type ExpectFirst<Str extends string, Expects extends string> = Str extends `${infer T}${ExpectRemoveFirst<Str, Expects>}` ? T : never;
  export type AnyFirst<Str extends string> = Str extends `${infer T}${infer _}` ? T : never;
  export type ExpectRemoveFirst<Str extends string, Expects extends string> = Str extends `${Expects}${infer T}` ? T : never;
  export type AnyRemoveFirst<Str extends string> = Str extends `${infer _}${infer T}` ? T : never;
}

export type Every = typeof detail.every;
export type First<Str extends string, Expects extends string | Every = Every> = {
  [_: string]: `${detail.ExpectFirst<Str, Expects>}`;
  [detail.every]: detail.AnyFirst<Str>;
}[Expects];
export type Last<Str extends string, Expects extends string> = Str extends `${RemoveLast<Str, Expects>}${infer T}` ? T : never;
export type RemoveFirst<Str extends string, Expects extends string | Every = Every> = {
  [_: string]: `${detail.ExpectRemoveFirst<Str, Expects>}`;
  [detail.every]: detail.AnyRemoveFirst<Str>;
}[Expects];
export type RemoveLast<Str extends string, Expects extends string> = Str extends `${infer T}${Expects}` ? T : never;

export type Extends<T, U> = (T extends U ? 1 : 0) extends 1 ? true : false;
export type Eq<T, U> = And<[Extends<T, U>, Extends<U, T>]>;
export type And<T extends boolean[]> = Extends<T[number], true>;
export type Or<T extends boolean[]> = Not<Extends<T[number], false>>;
export type Not<T extends boolean> = boolean extends T ? never : Extends<T, false>;

export type Assert<_ extends true> = never;
export type AssertNot<_ extends false> = never;

type _Str = 'abc';
type _Chars = 'a' | 'b' | 'c';

module detail {
  type Tile<T extends string, N extends Digits | DigitsStr | 10 | '10'> = [
      '',
      `${T}`,
      `${T}${T}`,
      `${T}${T}${T}`,
      `${T}${T}${T}${T}`,
      `${T}${T}${T}${T}${T}`,
      `${T}${T}${T}${T}${T}${T}`,
      `${T}${T}${T}${T}${T}${T}${T}`,
      `${T}${T}${T}${T}${T}${T}${T}${T}`,
      `${T}${T}${T}${T}${T}${T}${T}${T}${T}`,
      `${T}${T}${T}${T}${T}${T}${T}${T}${T}${T}`,
  ][N];
  
  export type MakeString<T, N extends string, X extends string = ''> =
      string extends N ? never :
      N extends '' ? X :
      First<N> extends infer U ? U extends DigitsStr ?
      MakeString<T, RemoveFirst<N>, `${Tile<T, U>}${Tile<X, 10>}`> :
      never : never;
}

export type MakeString<T extends string, N extends number | string> = detail.MakeString<T, `${N}`>;

//@ts-ignore
interface _Test {
  assert: Assert<true>;
  assertNot: AssertNot<false>;

  extends: [
    Assert<Extends<0, number>>,
    AssertNot<Extends<number, 0>>,
  ];
  eq: [
    Assert<Eq<0, 0>>,
    AssertNot<Eq<0, 1>>,
  ];
  and: [
    Assert<And<[true, true]>>,
    AssertNot<And<[true, false]>>,
    AssertNot<And<[false, true]>>,
    AssertNot<And<[false, false]>>,
  ];
  or: [
    Assert<Or<[true, false]>>,
    Assert<Or<[false, true]>>,
    Assert<Or<[true, true]>>,
    AssertNot<Or<[false, false]>>,
  ];
  not: [
    Assert<Not<false>>,
    AssertNot<Not<true>>,
  ];

  first: [
    Assert<Eq<First<_Str, _Chars>, 'a'>>,
    Assert<Eq<First<_Str>, 'a'>>
  ];
  last: Assert<Eq<Last<_Str, _Chars>, 'c'>>;
  removeFirst: [
    Assert<Eq<RemoveFirst<_Str, _Chars>, 'bc'>>,
    Assert<Eq<RemoveFirst<_Str>, 'bc'>>,
  ];
  removeLast: Assert<Eq<RemoveLast<_Str, _Chars>, 'ab'>>;
  unexpected: Assert<Eq<First<_Str, 'b'>, never>>;
}
