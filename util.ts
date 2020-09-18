import { DigitsStr } from './numeric';
import { HighSurrogates } from './high-surrogates';


namespace detail.every {
  export declare const tag: unique symbol;
}
export type Every = typeof detail.every.tag;

namespace detail.first {
  export type Expect<Str extends string, Expects extends string> = Str extends `${infer T}${ExpectRemove<Str, Expects>}` ? T : never;
  export type Any<Str extends string> = Str extends `${infer T}${AnyRemove<Str>}` ? T : never;
  export type ExpectRemove<Str extends string, Expects extends string> = Str extends `${Expects}${infer T}` ? T : never;
  type SurrogateRemove<Str extends string> = Str extends `${HighSurrogates}${infer _}${infer T}` ? T : never ;
  type CheckSurrogate<T extends string, U extends string> = T extends HighSurrogates ? never : U;
  type NoSurrogateRemove<Str extends string> = Str extends `${infer T}${infer U}` ? CheckSurrogate<T, U> : never;
  export type AnyRemove<Str extends string> = NoSurrogateRemove<Str> | SurrogateRemove<Str>;
}

export type First<Str extends string, Expects extends string | Every = Every> = {
  [_: string]: `${detail.first.Expect<Str, Extract<Expects, string>>}`;
  [detail.every.tag]: detail.first.Any<Str>;
}[Expects];
export type Last<Str extends string, Expects extends string> = Str extends `${RemoveLast<Str, Expects>}${infer T}` ? T : never;
export type RemoveFirst<Str extends string, Expects extends string | Every = Every> = {
  [_: string]: `${detail.first.ExpectRemove<Str, Extract<Expects, string>>}`;
  [detail.every.tag]: detail.first.AnyRemove<Str>;
}[Expects];
export type RemoveLast<Str extends string, Expects extends string> = Str extends `${infer T}${Expects}` ? T : never;
export type Before<Str extends string, Separator extends string> = Str extends `${infer T}${Separator}${infer _}` ? T : Str;
export type After<Str extends string, Separator extends string> = Str extends `${infer _}${Separator}${infer T}` ? T : null;
export type Separator<Str extends string, Separator extends string> = Str extends `${Before<Str, Separator>}${infer T}${After<Str, Separator>}` ? T : null;

export type Extends<T, U> = (T extends U ? 1 : 0) extends 1 ? true : false;
export type Same<T, U> = Extends<[T, U], [U, T]>;
export type And<T extends boolean[]> = Extends<T[number], true>;
export type Or<T extends boolean[]> = Not<Extends<T[number], false>>;
export type Not<T extends boolean> = boolean extends T ? never : Extends<T, false>;

export type Assert<_ extends true> = never;
export type AssertNot<_ extends false> = never;

namespace detail.makeString {
  type Tile<T extends string> = [
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
  ];
  
  export type Impl<T, N extends string, X extends string = ''> =
      string extends N ? never :
      N extends '' ? X :
      First<N> extends infer U ? U extends DigitsStr ?
      Impl<T, RemoveFirst<N>, `${Tile<Extract<T, string>>[U]}${Tile<X>[10]}`> :
      never : never;
}

export type MakeString<T extends string, N extends number | string> = detail.makeString.Impl<T, `${N}`>;

type _Str = 'abc';
type _Chars = 'a' | 'b' | 'c';

//@ts-ignore: Test cases
interface _Test {
  assert: Assert<true>;
  assertNot: AssertNot<false>;

  extends: [
    Assert<Extends<0, number>>,
    AssertNot<Extends<number, 0>>,
  ];
  same: [
    Assert<Same<0, 0>>,
    AssertNot<Same<0, 1>>,
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
    Assert<Same<First<_Str, _Chars>, 'a'>>,
    Assert<Same<First<_Str>, 'a'>>,
    Assert<Same<First<'😺🐶🐧'>, '😺'>>,
  ];
  last: Assert<Same<Last<_Str, _Chars>, 'c'>>;
  removeFirst: [
    Assert<Same<RemoveFirst<_Str, _Chars>, 'bc'>>,
    Assert<Same<RemoveFirst<_Str>, 'bc'>>,
    Assert<Same<RemoveFirst<'😺🐶🐧'>, '🐶🐧'>>,
  ];
  removeLast: Assert<Same<RemoveLast<_Str, _Chars>, 'ab'>>;
  unexpected: Assert<Same<First<_Str, 'b'>, never>>;
}
