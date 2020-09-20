import { DigitsStr, First, RemoveFirst } from './numeric';
import { Div2, Sub, Dec } from './numeric/integer';
import { Assert, Same, Every, First as First1, RemoveFirst as RemoveFirst1, Before, After } from './util';

namespace detail.tile {
  export type Table<T extends unknown[]> = [
    [],
    [...T],
    [...T, ...T],
    [...T, ...T, ...T],
    [...T, ...T, ...T, ...T],
    [...T, ...T, ...T, ...T, ...T],
    [...T, ...T, ...T, ...T, ...T, ...T],
    [...T, ...T, ...T, ...T, ...T, ...T, ...T],
    [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T],
    [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T],
    [...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T, ...T],
  ];

  export type Impl<T extends unknown[], N extends string, X extends unknown[] = []> =
      N extends '' ? X :
      First<N> extends infer U ? U extends DigitsStr ?
      Impl<T, RemoveFirst<N>, [...Table<T>[U], ...Table<X>['10']]> :
      never : never;
}

export type Tile<T extends unknown[], N extends string | number> = detail.tile.Impl<T, `${N}`>;

export type MakeTuple<T, N extends number | string> = Tile<[T], N>;

export type ToNumber<S extends string> = MakeTuple<unknown, S>['length'];


namespace detail.indexSequence {
  export type Number<T extends unknown[]> = {
    [K in keyof T]: ToNumber<Extract<K, string>>;
  }

  export type String<T extends unknown[]> = {
    [K in keyof T]: K;
  }
}

export type IndexSequence<N extends number | string> = detail.indexSequence.Number<MakeTuple<unknown, N>>;

export type StringIndexSequence<N extends number | string> = detail.indexSequence.String<MakeTuple<unknown, N>>;

namespace detail.head {
  export type Impl<T extends unknown[], U extends unknown[]> = {
    [K in keyof U]: T[Extract<K, keyof T>];
  }
}

export type Head<T extends unknown[], N extends number | string> =
  `${N}` extends keyof T ? detail.head.Impl<T, MakeTuple<unknown, N>> : T;

export type Tail<T extends unknown[], N extends number | string> =
  T extends [...Extract<Head<T, N>, unknown[]>, ...infer U] ? U : T;

export type Slice<T extends unknown[], N extends number | string, M extends number | string> =
  Tail<Extract<Head<T, M>, unknown[]>, N>;

export type Insert<T extends unknown[], U extends unknown[], N extends number | string> =
  [...Extract<Head<T, N>, unknown[]>, ...U, ...Extract<Tail<T, N>, unknown[]>];

export type Replace<T extends unknown[], U extends unknown[], N extends number | string, M extends number | string> =
  [...Extract<Head<T, N>, unknown[]>, ...U, ...Extract<Tail<T, M>, unknown[]>];

export type Erase<T extends unknown[], N extends number | string, M extends number | string> =
  [...Extract<Head<T, N>, unknown[]>, ...Extract<Tail<T, M>, unknown[]>];

export type Reverse<T extends unknown[]> = {
  [K in keyof T]: 
    Sub<`${T['length']}`, Extract<K, string>> extends infer K ?
      Dec<Extract<K, string>> extends infer K ?
        T[Extract<K, keyof T>] :
      never :
    never;
}

export type Flatten<T extends unknown[][]> = 
  T extends { length: 0 | 1 } ? [[], T[0]][T['length']] :
  Div2<`${T['length']}`> extends `${infer N}` ?
    [Flatten<Extract<Head<T, N>, unknown[][]>>, Flatten<Extract<Tail<T, N>, unknown[][]>>] extends [infer U, infer V] ?
      [...Extract<U, unknown[]>, ...Extract<V, unknown[]>] :
    never :
  never;

export type RecursiveFlatten<T extends unknown[]> = 
  T extends { length: 0 | 1 } ? T extends [unknown[]] ? RecursiveFlatten<T[0]> : [[], [T[0]]][T['length']] :
  Div2<`${T['length']}`> extends `${infer N}` ?
    [RecursiveFlatten<Extract<Head<T, N>, unknown[]>>, RecursiveFlatten<Extract<Tail<T, N>, unknown[]>>] extends [infer U, infer V] ?
      [...Extract<U, unknown[]>, ...Extract<V, unknown[]>] :
    never :
  never;

namespace detail.toTuple {
  type _3<T extends string, Expect extends string | Every, Result extends string[], Counter extends unknown[] = []> =
    [T, Counter] extends { 0: '' } | {1: { length: 9 }} ? [T, Result] :
    _3<RemoveFirst1<T, Expect>, Expect, [...Result, First1<T, Expect>], [...Counter, unknown]>;
  type _2<T extends string, Expect extends string | Every, Result extends string[], Counter extends unknown[] = []> =
    _3<T, Expect, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _2<Extract<T, string>, Expect, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  type _1<T extends string, Expect extends string | Every, Result extends string[], Counter extends unknown[] = []> =
    _2<T, Expect, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _1<Extract<T, string>, Expect, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  type _0<T extends string, Expect extends string | Every, Result extends string[], Counter extends unknown[] = []> =
    _1<T, Expect, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _0<Extract<T, string>, Expect, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  export type Impl<T extends string, Expect extends string | Every, Result extends string[] = [], Counter extends unknown[] = []> =
    _0<T, Expect, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? R :
    Impl<Extract<T, string>, Expect, Extract<R, string[]>, [...Counter, unknown]> :
    never;
}

export type ToTuple<T extends string, Expect extends string | Every = Every> = detail.toTuple.Impl<T, Expect>;

namespace detail.toReverseTuple {
  type _3<T extends string, Expect extends string | Every, Result extends string[], Counter extends unknown[] = []> =
    [T, Counter] extends { 0: '' } | {1: { length: 9 }} ? [T, Result] :
    _3<RemoveFirst1<T, Expect>, Expect, [First1<T, Expect>, ...Result], [...Counter, unknown]>;
  type _2<T extends string, Expect extends string | Every, Result extends string[], Counter extends unknown[] = []> =
    _3<T, Expect, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _2<Extract<T, string>, Expect, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  type _1<T extends string, Expect extends string | Every, Result extends string[], Counter extends unknown[] = []> =
    _2<T, Expect, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _1<Extract<T, string>, Expect, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  type _0<T extends string, Expect extends string | Every, Result extends string[], Counter extends unknown[] = []> =
    _1<T, Expect, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _0<Extract<T, string>, Expect, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  export type Impl<T extends string, Expect extends string | Every = Every, Result extends string[] = [], Counter extends unknown[] = []> =
    _0<T, Expect, Result> extends [infer T, infer R] ?
      [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? R :
      Impl<Extract<T, string>, Expect, Extract<R, string[]>, [...Counter, unknown]> :
    never;
}

export type ToReverseTuple<T extends string, Expect extends string | Every = Every> = detail.toReverseTuple.Impl<T, Expect>;

namespace detail.split {
  export type _3<T extends string | null, Separator extends string, Result extends string[], Counter extends unknown[] = []> =
    [T, Counter] extends { 0: null } | {1: { length: 9 }} ? [T, Result] :
    _3<After<Exclude<T, null>, Separator>, Separator, [...Result, Before<Exclude<T, null>, Separator>], [...Counter, unknown]>;
  type _2<T extends string | null, Separator extends string, Result extends string[], Counter extends unknown[] = []> =
    _3<T, Separator, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _2<Extract<T, string>, Separator, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  type _1<T extends string | null, Separator extends string, Result extends string[], Counter extends unknown[] = []> =
    _2<T, Separator, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _1<Extract<T, string>, Separator, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  type _0<T extends string | null, Separator extends string, Result extends string[], Counter extends unknown[] = []> =
    _1<T, Separator, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _0<Extract<T, string>, Separator, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  export type Impl<T extends string | null, Separator extends string, Result extends string[] = [], Counter extends unknown[] = []> =
    _0<T, Separator, Result> extends [infer T, infer R] ?
      [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? R :
      Impl<Extract<T, string>, Separator, Extract<R, string[]>, [...Counter, unknown]> :
    never;
}

export type Split<T extends string, Separator extends string> = detail.split.Impl<T, Separator>;

namespace detail.reverseSplit {
  export type _3<T extends string | null, Separator extends string, Result extends string[], Counter extends unknown[] = []> =
    [T, Counter] extends { 0: null } | {1: { length: 9 }} ? [T, Result] :
    _3<After<Exclude<T, null>, Separator>, Separator, [Before<Exclude<T, null>, Separator>, ...Result], [...Counter, unknown]>;
  type _2<T extends string | null, Separator extends string, Result extends string[], Counter extends unknown[] = []> =
    _3<T, Separator, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _2<Extract<T, string>, Separator, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  type _1<T extends string | null, Separator extends string, Result extends string[], Counter extends unknown[] = []> =
    _2<T, Separator, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _1<Extract<T, string>, Separator, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  type _0<T extends string | null, Separator extends string, Result extends string[], Counter extends unknown[] = []> =
    _1<T, Separator, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
    _0<Extract<T, string>, Separator, Extract<R, string[]>, [...Counter, unknown]> :
    never;
  export type Impl<T extends string | null, Separator extends string, Result extends string[] = [], Counter extends unknown[] = []> =
    _0<T, Separator, Result> extends [infer T, infer R] ?
      [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? R :
      Impl<Extract<T, string>, Separator, Extract<R, string[]>, [...Counter, unknown]> :
    never;
}

export type ReverseSplit<T extends string, Separator extends string> = detail.reverseSplit.Impl<T, Separator>;

export type Join<T extends string[], Separator extends string = ''> =
  T extends { length: 0 | 1 } ? ['', T[0]][T['length']] :
  Div2<`${T['length']}`> extends `${infer N}` ?
    [Join<Extract<Head<T, N>, string[]>, Separator>, Join<Extract<Tail<T, N>, string[]>, Separator>] extends [infer U, infer V] ?
      `${Extract<U, string>}${Separator}${Extract<V, string>}` :
    never :
  never;

export type Zip<T extends unknown[], U extends unknown[]> = keyof T extends keyof U ? {
  [K in keyof U]: K extends keyof T ? [T[K], U[K]] : [never, U[K]];
} : {
  [K in keyof T]: K extends keyof U ? [T[K], U[K]] : [T[K], never];
};

export type Product<T extends unknown[], U extends unknown[]> = Flatten<{
  [K1 in keyof T]: { [K2 in keyof U]: [T[K1], U[K2]] };
}>;

namespace detail.filter {
  export type Impl<T extends unknown[], F extends boolean[]> = 
    T extends { length: 0 | 1 } ? [[], F[0] extends true ? [T[0]] : []][T['length']] :
    Div2<`${T['length']}`> extends `${infer N}` ?
      [
        Impl<Extract<Head<T, N>, unknown[]>, Extract<Head<F, N>, boolean[]>>,
        Impl<Extract<Tail<T, N>, unknown[]>, Extract<Tail<F, N>, boolean[]>>,
      ] extends [infer U, infer V] ?
        [...Extract<U, unknown[]>, ...Extract<V, unknown[]>] :
      never :
    never;
}

export type Filter<T extends unknown[], F extends { [K in keyof T]: boolean }> = detail.filter.Impl<T, F>;

// @ts-ignore: Test cases
interface _Test {
  makeTuple: Assert<Same<MakeTuple<0, 13>, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]>>;
  indexSequence: Assert<Same<IndexSequence<10>, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]>>;
  stringIndexSequence: Assert<Same<StringIndexSequence<10>, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']>>;
  head: Assert<Same<Head<['nade', 'mofu', 'nyan'], 1>, ['nade']>>;
  tail: Assert<Same<Tail<['nade', 'mofu', 'nyan'], 2>, ['nyan']>>;
  slice: Assert<Same<Slice<['nade', 'mofu', 'nyan'], 1, 2>, ['mofu']>>;
  insert: Assert<Same<Insert<['nade', 'mofu', 'nyan'], ['piyo', 'poyo'], 1>, ['nade', 'piyo', 'poyo', 'mofu', 'nyan']>>;
  replace: Assert<Same<Replace<['nade', 'mofu', 'nyan'], ['piyo', 'poyo'], 1, 2>, ['nade', 'piyo', 'poyo', 'nyan']>>;
  erase: Assert<Same<Erase<['nade', 'mofu', 'nyan'], 1, 2>, ['nade', 'nyan']>>;
  reverse: Assert<Same<Reverse<['nade', 'mofu', 'nyan']>, ['nyan', 'mofu', 'nade']>>;
  flatten: Assert<Same<Flatten<[['nade'], ['mofu', 'nyan']]>, ['nade', 'mofu', 'nyan']>>;
  recursiveFlatten: Assert<Same<RecursiveFlatten<['nade', ['mofu', ['nyan']]]>, ['nade', 'mofu', 'nyan']>>;
  toTuple: [
    Assert<Same<ToTuple<'nade mofu nyan'>, ['n', 'a', 'd', 'e', ' ', 'm', 'o', 'f', 'u', ' ', 'n', 'y', 'a', 'n']>>,
    Assert<Same<ToTuple<'nade mofu nyan', 'nade' | 'mofu' | 'nyan' | ' '>, ['nade', ' ', 'mofu', ' ', 'nyan']>>,
    Assert<Same<ToTuple<'😺🐶🐧'>, ['😺', '🐶', '🐧']>>,
  ];
  toReverseTuple: Assert<Same<
    ToReverseTuple<'nade mofu nyan', ToTuple<'nade mofu nyan'>[number]>,
    ['n', 'a', 'y', 'n', ' ', 'u', 'f', 'o', 'm', ' ', 'e', 'd', 'a', 'n']
  >>;
  split: [
    Assert<Same<Split<'nade,mofu,nyan', ','>, ['nade', 'mofu', 'nyan']>>,
    // Splitに空文字を渡した時はサロゲートペアが考慮されないことの確認
    Assert<Same<Split<'😺🐶🐧', ''>, [ '\ud83d', '\ude3a', '\ud83d', '\udc36', '\ud83d', '\udc27' ]>>,
  ];
  reverseSplit: Assert<Same<ReverseSplit<'nade,mofu,nyan', ','>, ['nyan', 'mofu', 'nade']>>;
  join: Assert<Same<Join<['nade', 'mofu', 'nyan'], ','>, 'nade,mofu,nyan'>>;
  tile: Assert<Same<Tile<['nade', 'mofu', 'nyan'], 11>, [
    'nade', 'mofu', 'nyan', 'nade', 'mofu', 'nyan', 'nade', 'mofu', 'nyan', 'nade', 'mofu', 'nyan', 'nade', 'mofu',
    'nyan', 'nade', 'mofu', 'nyan', 'nade', 'mofu', 'nyan', 'nade', 'mofu', 'nyan', 'nade', 'mofu', 'nyan', 'nade',
    'mofu', 'nyan', 'nade', 'mofu', 'nyan'
  ]>>;
  zip: [
    Assert<Same<Zip<['nade', 'mofu', 'nyan'], ['piyo', 'poyo']>, [['nade', 'piyo'], ['mofu', 'poyo'], ['nyan', never]]>>,
    Assert<Same<Zip<['piyo', 'poyo'], ['nade', 'mofu', 'nyan']>, [['piyo', 'nade'], ['poyo', 'mofu'], [never, 'nyan']]>>,
  ];
  product: Assert<Same<Product<['nade', 'mofu', 'nyan'], ['piyo', 'poyo']>, [
    ['nade', 'piyo'], ['nade', 'poyo'], ['mofu', 'piyo'], ['mofu', 'poyo'], ['nyan', 'piyo'], ['nyan', 'poyo'],
  ]>>;
  filter: Assert<Same<Filter<StringIndexSequence<10>, Tile<[true, false], 5>>, ['0', '2', '4', '6', '8']>>;
}
