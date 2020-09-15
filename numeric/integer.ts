import { DigitsStr, First, Last, RemoveFirst, RemoveLast } from '.';
import { Head, Join, MakeTuple, Reverse, Slice, StringIndexSequence, Tail, Tile, ToReverseTuple, ToTuple } from '../tuple';
import { Assert, Same, MakeString } from '../util';

export type Sign = '+' | '-';

export type Abs<T extends string> = T extends `${Sign}${infer U}` ? U : T;

module detail.inc {
  export type Impl<T extends string, Sign extends '-' | ''> = 
    T extends '' ? `${Sign}1` :
    [RemoveLast<T>, Last<T>] extends [infer U, infer V] ?
      V extends '9' ? `${Impl<Extract<U, string>, Sign>}0` :
      `${Sign}${RemoveLast<T>}${[1, 2, 3, 4, 5, 6, 7, 8, 9, never][Extract<Last<T>, DigitsStr>]}` :
    never;
}

export type Inc<T extends string> =
  T extends '-1' ? '0' :
  T extends `-${infer T}` ? detail.dec.Impl<T, '-'>:
  detail.inc.Impl<T, ''>;

module detail.add {
  type Indices = StringIndexSequence<10>;
  type Map<T, N> = { [K in keyof T]: [T[K], N] };
  type Vec = [...Map<Indices, 0>, ...Map<Indices, 1>];
  type Vec2 = [Slice<Vec, 1, 11>, Slice<Vec, 2, 12>, Slice<Vec, 3, 13>, Slice<Vec, 4, 14>, Slice<Vec, 5, 15>,
                Slice<Vec, 6, 16>, Slice<Vec, 7, 17>, Slice<Vec, 8, 18>, Slice<Vec, 9, 19>];
  type Vec3 = [[Slice<Vec, 0, 10>, ...Vec2], [...Vec2,  Slice<Vec, 10, 20>]];  
  type Type<L1 extends string, R1 extends string, Carry extends 0 | 1> =
    Vec3[Carry][Extract<L1, DigitsStr>][Extract<R1, DigitsStr>];

  export type Impl<
    L extends string,
    R extends string,
    Carry extends 0 | 1,
    Sign extends '' | '-',
  > = L extends '' ? [`${Sign}${R}`, inc.Impl<R, Sign>][Carry] :
      R extends '' ? [`${Sign}${L}`, inc.Impl<L, Sign>][Carry] :
      Impl<RemoveLast<L>, RemoveLast<R>, Type<Last<L>, Last<R>, Carry>[1], Sign> extends infer U ?
        `${Extract<U, string>}${Extract<Type<Last<L>, Last<R>, Carry>[0], DigitsStr>}` :
      never;
}

export type Add<T extends string, U extends string> =
  T extends `-${infer T}` ?
    U extends `-${infer U}` ? detail.add.Impl<T, U, 0, '-'> :
    detail.sub.Impl<U, T, 0, ''> | detail.sub.Impl<T, U, 0, '-'>:
  U extends `-${infer U}` ? detail.sub.Impl<T, U, 0, ''> | detail.sub.Impl<U, T, 0, '-'>:
  detail.add.Impl<T, U, 0, ''>;

module detail.dec {
  export type Impl<T extends string, Sign extends '-' | ''> = 
    T extends '' | '0' ? never :
    [RemoveLast<T>, Last<T>] extends [infer U, infer V] ?
      V extends '0' ? `${Impl<Extract<U, string>, Sign>}9` :
      `${Sign}${RemoveLast<T>}${[never, U extends '' ? '' : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][Extract<Last<T>, DigitsStr>]}` :
    never;
}

export type Dec<T extends string> =
  T extends '0' | '1' ? ['-1', '0'][T] :
  T extends `-${infer T}` ? detail.inc.Impl<T, '-'> :
  detail.dec.Impl<T, ''>;

module detail.sub {
  type Indices = ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];
  type Map<T, N> = { [K in keyof T]: [T[K], N] };
  type Vec = [...Map<Indices, 0>, ...Map<Indices, 1>];
  type Vec2 = [Slice<Vec, 9, 19>, Slice<Vec, 8, 18>, Slice<Vec, 7, 17>, Slice<Vec, 6, 16>, Slice<Vec, 5, 15>,
                Slice<Vec, 4, 14>, Slice<Vec, 3, 13>, Slice<Vec, 2, 12>, Slice<Vec, 1, 11>];
  type Vec3 = [[...Vec2,  Slice<Vec, 0, 10>], [Slice<Vec, 10, 20>, ...Vec2]];
  type Type<L1 extends string, R1 extends string, Carry extends 0 | 1> =
    Vec3[Carry][Extract<L1, DigitsStr>][Extract<R1, DigitsStr>];
  type Erase0<
    T,
    U extends Extract<T, string> = Extract<T, string>,
    V extends Exclude<U, '0' | '-0'> = Exclude<U, '0' | '-0'>,
    W extends Extract<T, V | '0' | '-0'> = Extract<T, V | '0' | '-0'>,
  > = ({ [K in V]: U } & { '0': ''} & { '-0' : '-'})[W];
  export type Impl<
    L extends string,
    R extends string,
    Carry extends 0 | 1,
    Sign extends '' | '-',
  > = R extends '' ? [`${Sign}${L}`, dec.Impl<L, Sign>][Carry] :
      L extends '' ? never :
      Impl<RemoveLast<L>, RemoveLast<R>, Type<Last<L>, Last<R>, Carry>[1], Sign> extends infer U ?
        `${Erase0<U>}${Extract<Type<Last<L>, Last<R>, Carry>[0], DigitsStr>}` :
      never;
}

export type Sub<T extends string, U extends string> =
  T extends `-${infer T}` ?
    U extends `-${infer U}` ? detail.sub.Impl<T, U, 0, '-'> | detail.sub.Impl<U, T, 0, ''> :
    detail.add.Impl<T, U, 0, '-'> :
  U extends `-${infer U}` ? detail.add.Impl<T, U, 0, ''> :
  detail.sub.Impl<T, U, 0, ''> | detail.sub.Impl<U, T, 0, '-'>;

module detail.div2 {
  // Mapped type と Flatten を駆使すれば生成できるが Flatten がこれに依存しているため使えない
  type Quotient<Pad extends '' | '0'> = [
    Pad, Pad, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
  ];
  type Complement = Tile<['', '1'], 10>;
  type Padding<Pad extends '' | '0'> = [ Pad, Pad, ...MakeTuple<'0', 18> ];
  type Keys = StringIndexSequence<20>[number];
  export type Impl<N extends string, Carry extends '' | '1', Pad extends '' | '0'> =
    N extends '' ? '' :
    Impl<
      RemoveFirst<N>,
      Complement[Extract<`${Carry}${First<N>}`, Keys>],
      Padding<Pad>[Extract<`${Carry}${First<N>}`, Keys>]
    > extends infer U ?
      `${Quotient<Pad>[Extract<`${Carry}${First<N>}`, Keys>]}${Extract<U, string>}` :
    never;
}

export type Div2<N extends string> = detail.div2.Impl<N, '', ''>;

export type Sum<T extends string[]> =
  T extends { length: 0 | 1 } ? ['0', T[0]][T['length']] :
  Div2<`${T['length']}`> extends `${infer N}` ?
    [Head<T, N>, Tail<T, N>]extends [infer H, infer T] ?
      Add<Sum<Extract<H, string[]>>, Sum<Extract<T, string[]>>> :
    never :
  never;

module detail.mul {
  type X<T extends string[], U extends string[]> = {
    [K in keyof T]: add.Impl<Extract<T[K], string>, Extract<U[Extract<K, keyof U>], string>, 0, ''>;
  }
  type _0 = MakeTuple<'0', 10>;
  type _1 = StringIndexSequence<10>;
  type _2 = X<_1, _1>;
  type _4 = X<_2, _2>;
  type _8 = X<_4, _4>;
  type Table = [_0, _1, _2, X<_1, _2>, _4, X<_1, _4>, X<_2, _4>, X<_1, X<_2, _4>>, _8, X<_1, _8>];
  type Tenth<T extends string, N extends string> = T extends '0' | '-0' ? '0' : `${T}${MakeString<'0', N>}`;
  export type Impl<L extends string[], R extends string[], Sign extends '' | '-'> = {
    [K1 in keyof L]: Sum<{
      [K2 in keyof R]: `${Sign}${Tenth<Table[Extract<L[K1], DigitsStr>][Extract<R[K2], DigitsStr>], Extract<K2, string>>}`;
    }>;
  } extends [...infer T] ? Sum<{ [K in keyof T]: Tenth<Extract<T[K], string>, Extract<K, string>> }> : never;
}

export type Mul<L extends string, R extends string> =
  L extends `-${infer L}` ?
    R extends `-${infer R}` ? detail.mul.Impl<ToReverseTuple<L>, ToReverseTuple<R>, ''> :
    detail.mul.Impl<ToReverseTuple<L>, ToReverseTuple<R>, '-'> :
  R extends `-${infer R}` ? detail.mul.Impl<ToReverseTuple<L>, ToReverseTuple<R>, '-'>:
  detail.mul.Impl<ToReverseTuple<L>, ToReverseTuple<R>, ''>;

module detail.div {
  type Padding<L extends string[], R extends string[]> = MakeString<'0', Sub<`${L['length']}`, `${R['length']}`>>;
  type Impl2<L extends string, R extends string, Sign extends '' | '-', Pad extends string, Result extends string> =
    Sub<L, `${R}${Pad}`> extends `-${infer _}` ?
      Pad extends '' ? Result :
      Impl2<L, R, Sign, RemoveFirst<Pad>, Result> :
    Impl2<Sub<L, `${R}${Pad}`>, R, Sign, Pad, Add<Result, `${Sign}1${Pad}`>>;
  export type Impl<L extends string, R extends string, Sign extends '' | '-'> =
    Gt<L, R> extends true ? Impl2<L, R, Sign, Padding<ToTuple<L>, ToTuple<R>>, '0'> :
    {'true': '1', 'false': '0'}[`${Eq<L, R>}`];
}

export type Div<L extends string, R extends string> =
  R extends '0' | '-0' ? never :
  L extends `-${infer L}` ?
    R extends `-${infer R}` ? detail.div.Impl<L, R, ''> :
    detail.div.Impl<L, R, '-'> :
  R extends `-${infer R}` ? detail.div.Impl<L, R, '-'>:
  detail.div.Impl<L, R, ''>;

module detail.mod {
  type Padding<L extends string[], R extends string[]> = MakeString<'0', Sub<`${L['length']}`, `${R['length']}`>>;
  type Impl2<L extends string, R extends string, Sign extends '' | '-', Pad extends string> =
    Sub<L, `${R}${Pad}`> extends `-${infer _}` ?
      Pad extends '' ? `${Sign}${L}` :
      Impl2<L, R, Sign, RemoveFirst<Pad>> :
    Impl2<Sub<L, `${R}${Pad}`>, R, Sign, Pad>;
  export type Impl<L extends string, R extends string, Sign extends '' | '-'> =
    Gt<L, R> extends true ? Impl2<L, R, Sign, Padding<ToTuple<L>, ToTuple<R>>> :
    {'true': '0', 'false': `${Sign}${L}`}[`${Eq<L, R>}`];
}

export type Mod<L extends string, R extends string> =
  R extends '0' | '-0' ? never :
  L extends `-${infer L}` ?
    R extends `-${infer R}` ? detail.mod.Impl<L, R, '-'> :
    detail.mod.Impl<L, R, '-'> :
  R extends `-${infer R}` ? detail.mod.Impl<L, R, ''>:
  detail.mod.Impl<L, R, ''>;

module detail.compare {
  type _0 = [...MakeTuple<'0', 9>, '', ...MakeTuple<'1', 9>];
  type Map<T extends string[]> = {
    [K in keyof T]: Slice<_0, Extract<T[K], string>, Add<Extract<T[K], string>, '10'>>;
  };
  type Table = Map<Reverse<StringIndexSequence<10>>>;
  type Check<L extends string[], R extends string[]> = 
    `${keyof R extends keyof L ? 'A' : ''}${keyof L extends keyof R ? 'B' : ''}`;
  export type Impl<L extends string[], R extends string[]> = {
    'A': 1;
    'B': -1;
    'AB': Join<Extract<{
      [K in keyof L]: Table[Extract<L[K], DigitsStr>][Extract<R[Extract<K, keyof R>], DigitsStr>];
    }, string[]>> extends `${infer T}${infer _}` ? [1, -1][Extract<T, '0' |'1'>] : 0;
    '': never;
  }[Check<L, R>];
}

export type Compare<L extends string, R extends string> =
  [L, R] extends ['0' | '-0', '0' | '-0'] | [R, L] ? 0 :
  L extends `-${infer L}` ?
    R extends `-${infer R}` ?
      detail.compare.Impl<ToTuple<R>, ToTuple<L>> :
    -1 :
  R extends `-${infer _}` ? 1 :
  detail.compare.Impl<ToTuple<L>, ToTuple<R>>;

export type Eq<L extends string, R extends string> = {[-1]: false, 0: true, 1: false}[Compare<L, R>];
export type Ne<L extends string, R extends string> = {[-1]: true, 0: false, 1: true}[Compare<L, R>];
export type Gt<L extends string, R extends string> = {[-1]: false, 0: false, 1: true}[Compare<L, R>];
export type Ge<L extends string, R extends string> = {[-1]: false, 0: true, 1: true}[Compare<L, R>];
export type Le<L extends string, R extends string> = {[-1]: true, 0: true, 1: false}[Compare<L, R>];
export type Lt<L extends string, R extends string> = {[-1]: true, 0: false, 1: false}[Compare<L, R>];

// @ts-ignore
interface _Test {
  inc: [
    Assert<Same<Inc<'9'>, '10'>>,
    Assert<Same<Inc<'-1'>, '0'>>,
    Assert<Same<Inc<'-10'>, '-9'>>,
  ];
  dec: [
    Assert<Same<Dec<'10'>, '9'>>,
    Assert<Same<Dec<'0'>, '-1'>>,
    Assert<Same<Dec<'1'>, '0'>>,
    Assert<Same<Dec<'-9'>, '-10'>>,
  ];
  add: [
    Assert<Same<Add<'1', '9'>, '10'>>,
    Assert<Same<Add<'1', '8'>, '9'>>,
    Assert<Same<Add<'28554', '66181'>, '94735'>>,
    Assert<Same<Add<'28554', '-66181'>, '-37627'>>,
    Assert<Same<Add<'-28554', '66181'>, '37627'>>,
    Assert<Same<Add<'-28554', '-66181'>, '-94735'>>,
  ];
  sub: [
    Assert<Same<Sub<'10', '1'>, '9'>>,
    Assert<Same<Sub<'20', '11'>, '9'>>,
    Assert<Same<Sub<'9', '1'>, '8'>>,
    Assert<Same<Sub<'28554', '66181'>, '-37627'>>,
    Assert<Same<Sub<'28554', '-66181'>, '94735'>>,
    Assert<Same<Sub<'-28554', '66181'>, '-94735'>>,
    Assert<Same<Sub<'-28554', '-66181'>, '37627'>>,
  ];
  sum: Assert<Same<Sum<StringIndexSequence<100>>, '4950'>>;
  mul: [
    Assert<Same<Mul<'28554', '66181'>, '1889732274'>>,
    Assert<Same<Mul<'-28554', '66181'>, '-1889732274'>>,
    Assert<Same<Mul<'28554', '-66181'>, '-1889732274'>>,
    Assert<Same<Mul<'-28554', '-66181'>, '1889732274'>>,
    Assert<Same<Mul<'28554', '0'>, '0'>>,
  ];
  div: [
    Assert<Same<Div<'28554', '66181'>, '0'>>,
    Assert<Same<Div<'66181', '28554'>, '2'>>,
    Assert<Same<Div<'66181', '-28554'>, '-2'>>,
    Assert<Same<Div<'-66181', '28554'>, '-2'>>,
    Assert<Same<Div<'-66181', '-28554'>, '2'>>,
    Assert<Same<Div<'66181000', '28554'>, '2317'>>,
  ];
  mod: [
    Assert<Same<Mod<'28554', '66181'>, '28554'>>,
    Assert<Same<Mod<'66181', '28554'>, '9073'>>,
    Assert<Same<Mod<'66181', '-28554'>, '9073'>>,
    Assert<Same<Mod<'-66181', '28554'>, '-9073'>>,
    Assert<Same<Mod<'-66181', '-28554'>, '-9073'>>,
    Assert<Same<Div<'66181000', '28554'>, '2317'>>,
    Assert<Same<Add<Mul<Div<'7', '3'>, '3'>, Mod<'7', '3'>>, '7'>>,
    Assert<Same<Add<Mul<Div<'7', '-3'>, '-3'>, Mod<'7', '-3'>>, '7'>>,
    Assert<Same<Add<Mul<Div<'-7', '3'>, '3'>, Mod<'-7', '3'>>, '-7'>>,
    Assert<Same<Add<Mul<Div<'-7', '-3'>, '-3'>, Mod<'-7', '-3'>>, '-7'>>,
  ];
  compare: [
    Assert<Same<Compare<'28554', '66181'>, -1>>,
    Assert<Same<Compare<'-28554', '66181'>, -1>>,
    Assert<Same<Compare<'28554', '-66181'>, 1>>,
    Assert<Same<Compare<'-28554', '-66181'>, 1>>,
    Assert<Same<Compare<'66181', '28554'>, 1>>,
    Assert<Same<Compare<'-66181', '28554'>, -1>>,
    Assert<Same<Compare<'66181', '-28554'>, 1>>,
    Assert<Same<Compare<'-66181', '-28554'>, -1>>,
    Assert<Same<Compare<'28554', '28554'>, 0>>,
    Assert<Same<Compare<'-28554', '-28554'>, 0>>,
    Assert<Same<Compare<'0', '0'>, 0>>,
    Assert<Same<Compare<'0', '-0'>, 0>>,
    Assert<Same<Compare<'0', '1'>, -1>>,
    Assert<Same<Compare<'0', '-1'>, 1>>,
    Assert<Same<Compare<'-0', '0'>, 0>>,
    Assert<Same<Compare<'-0', '-0'>, 0>>,
    Assert<Same<Compare<'-0', '1'>, -1>>,
    Assert<Same<Compare<'-0', '-1'>, 1>>,
    Assert<Same<Compare<'1', '0'>, 1>>,
    Assert<Same<Compare<'1', '-0'>, 1>>,
    Assert<Same<Compare<'-1', '0'>, -1>>,
    Assert<Same<Compare<'-1', '-0'>, -1>>,
  ]
}
