import { Digits, DigitsStr, First, RemoveFirst } from "./numeric";
import { Div2 } from "./numeric/integer";
import { Assert, Eq, First as First1, RemoveFirst as RemoveFirst1 } from "./util";

module detail {
  export type Tile<T extends unknown[], N extends Digits | DigitsStr | 10 | '10'> = [
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
  ][N];
  
  export type MakeTuple<T, N extends string, X extends unknown[] = []> =
      string extends N ? never :
      N extends '' ? X :
      First<N> extends infer U ? U extends DigitsStr ?
      MakeTuple<T, RemoveFirst<N>, [...Tile<[T], U>, ...Tile<X, 10>]> :
      never : never;

  export type IndexSequence<T extends unknown[]> = {
    [K in keyof T]: K extends string ? ToNumber<K> : never;
  }

  export type StringIndexSequence<T extends unknown[]> = {
    [K in keyof T]: K;
  }
}

export type MakeTuple<T, N extends number | string> = detail.MakeTuple<T, `${N}`>;

export type ToNumber<S extends string> = detail.MakeTuple<unknown, S>['length'];

export type IndexSequence<N extends number | string> = detail.IndexSequence<MakeTuple<unknown, N>>;

export type StringIndexSequence<N extends number | string> = detail.StringIndexSequence<MakeTuple<unknown, N>>;

module detail {
  export type Head<T extends unknown[], U extends unknown[]> = {
    [K in keyof U]: T[Extract<K, keyof T>];
  }
}

export type Head<T extends unknown[], N extends number | string> =
  `${N}` extends keyof T ? detail.Head<T, MakeTuple<unknown, N>> : T;

export type Tail<T extends unknown[], N extends number | string> =
  T extends [...Extract<Head<T, N>, unknown[]>, ...infer U] ? U : T;

export type Slice<T extends unknown[], N extends number | string, M extends number | string> =
  Tail<Extract<Head<T, M>, unknown[]>, N>;

export type Reverse<T extends unknown[]> = {
  [K in keyof T]: [unknown, ...T][Tail<T, Extract<K, string>>['length']]
}

export type Flatten<T extends unknown[][]> = 
  T extends [] ? [] :
  T extends [[...infer U]] ? U :
  Div2<`${T['length']}`> extends `${infer N}` ?
  [Flatten<Extract<Head<T, N>, unknown[][]>>, Flatten<Extract<Tail<T, N>, unknown[][]>>] extends [infer U, infer V] ?
    [...Extract<U, unknown[]>, ...Extract<V, unknown[]>] :
  never : never;

module detail {
  module tuTuple {
    export type _3<T extends string, Result extends string[], Counter extends unknown[] = []> =
      [T, Counter] extends { 0: '' } | {1: { length: 5 }} ? [T, Result] :
      _3<RemoveFirst1<T>, [...Result, First1<T>], [...Counter, unknown]>;
    export type _2<T extends string, Result extends string[], Counter extends unknown[] = []> =
      _3<T, Result> extends [infer T, infer R] ?
      [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
      _2<Extract<T, string>, Extract<R, string[]>, [...Counter, unknown]> :
      never;
    export type _1<T extends string, Result extends string[], Counter extends unknown[] = []> =
      _2<T, Result> extends [infer T, infer R] ?
      [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
      _1<Extract<T, string>, Extract<R, string[]>, [...Counter, unknown]> :
      never;
    export type _0<T extends string, Result extends string[], Counter extends unknown[] = []> =
      _1<T, Result> extends [infer T, infer R] ?
      [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? [T, R] :
      _0<Extract<T, string>, Extract<R, string[]>, [...Counter, unknown]> :
      never;
  }
  export type ToTuple<T extends string, Result extends string[] = [], Counter extends unknown[] = []> =
    tuTuple._0<T, Result> extends [infer T, infer R] ?
    [T, Counter] extends { 0: '' } | {1: { length: 4 }} ? R :
    ToTuple<Extract<T, string>, Extract<R, string[]>, [...Counter, unknown]> :
    never;
}

export type ToTuple<T extends string> = detail.ToTuple<T>;
export type Join<T extends string[], Separator extends string = ''> =
  T extends [] ? '' :
  T extends [infer U] ? U :
  Div2<`${T['length']}`> extends `${infer N}` ?
  [Join<Extract<Head<T, N>, string[]>>, Join<Extract<Tail<T, N>, string[]>, Separator>] extends [infer U, infer V] ?
    `${Extract<U, string>}${Separator}${Extract<V, string>}` :
  never : never;

// @ts-ignore
interface _Test {
  makeTuple: Assert<Eq<MakeTuple<0, 13>, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]>>;
  indexSequence: Assert<Eq<IndexSequence<10>, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]>>;
  stringIndexSequence: Assert<Eq<StringIndexSequence<10>, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]>>;
  head: Assert<Eq<Head<['nade', 'mofu', 'nyan'], 1>, ['nade']>>;
  tail: Assert<Eq<Tail<['nade', 'mofu', 'nyan'], 2>, ['nyan']>>;
  slice: Assert<Eq<Slice<['nade', 'mofu', 'nyan'], 1, 2>, ['mofu']>>;
  reverse: Assert<Eq<Reverse<['nade', 'mofu', 'nyan']>, ['nyan', 'mofu', 'nade']>>;
  flatten: Assert<Eq<Flatten<[['nade'], ['mofu', 'nyan']]>, ['nade', 'mofu', 'nyan']>>;
  toTuple: Assert<Eq<ToTuple<'nade mofu nyan'>, ['n', 'a', 'd', 'e', ' ', 'm', 'o', 'f', 'u', ' ', 'n', 'y', 'a', 'n']>>;
  join: Assert<Eq<Join<['nade', 'mofu', 'nyan'], ','>, 'nade,mofu,nyan'>>;
}
