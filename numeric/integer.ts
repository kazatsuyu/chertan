import { DigitsStr, First, Last, RemoveFirst, RemoveLast } from '.';
import { Head, MakeTuple, Slice, StringIndexSequence, Tail, Tile, ToReverseTuple, ToTuple } from '../tuple';
import { Assert, Eq, MakeString } from '../util';

export type Sign = '+' | '-';

export type Abs<T extends string> = T extends `${Sign}${infer U}` ? U : T;

module detail {

  export type Inc<T extends string, Sign extends '-' | ''> = 
    T extends '' ? `${Sign}1` :
    [RemoveLast<T>, Last<T>] extends [infer U, infer V] ?
      V extends '9' ? `${Inc<Extract<U, string>, Sign>}0` :
      `${Sign}${RemoveLast<T>}${[1, 2, 3, 4, 5, 6, 7, 8, 9, never][Extract<Last<T>, DigitsStr>]}` :
    never;

  module add {
    type Indices = StringIndexSequence<10>;
    type Map<T, N> = { [K in keyof T]: [T[K], N] };
    type Vec = [...Map<Indices, 0>, ...Map<Indices, 1>];
    type Vec2 = [Slice<Vec, 1, 11>, Slice<Vec, 2, 12>, Slice<Vec, 3, 13>, Slice<Vec, 4, 14>, Slice<Vec, 5, 15>,
                 Slice<Vec, 6, 16>, Slice<Vec, 7, 17>, Slice<Vec, 8, 18>, Slice<Vec, 9, 19>];
    type Vec3 = [[Slice<Vec, 0, 10>, ...Vec2], [...Vec2,  Slice<Vec, 10, 20>]];  
    export type Type<L1 extends string, R1 extends string, Carry extends 0 | 1> =
      Vec3[Carry][Extract<L1, DigitsStr>][Extract<R1, DigitsStr>];
  }

  export type Add<
    L extends string,
    R extends string,
    Carry extends 0 | 1,
    Sign extends '' | '-',
  > = L extends '' ? [`${Sign}${R}`, Inc<R, Sign>][Carry] :
      R extends '' ? [`${Sign}${L}`, Inc<L, Sign>][Carry] :
      Add<RemoveLast<L>, RemoveLast<R>, add.Type<Last<L>, Last<R>, Carry>[1], Sign> extends infer U ?
        `${Extract<U, string>}${Extract<add.Type<Last<L>, Last<R>, Carry>[0], DigitsStr>}` :
      never;
}

export type Inc<T extends string> =
  T extends '-1' ? '0' :
  T extends `-${infer T}` ? detail.Dec<T, '-'>:
  detail.Inc<T, ''>;

export type Add<T extends string, U extends string> =
  T extends `-${infer T}` ?
    U extends `-${infer U}` ? detail.Add<T, U, 0, '-'> :
    detail.Sub<U, T, 0, ''> | detail.Sub<T, U, 0, '-'>:
  U extends `-${infer U}` ? detail.Sub<T, U, 0, ''> | detail.Sub<U, T, 0, '-'>:
  detail.Add<T, U, 0, ''>;

module detail {
  export type Dec<T extends string, Sign extends '-' | ''> = 
    T extends '' | '0' ? never :
    [RemoveLast<T>, Last<T>] extends [infer U, infer V] ?
      V extends '0' ? `${Dec<Extract<U, string>, Sign>}9` :
      `${Sign}${RemoveLast<T>}${[never, U extends '' ? '' : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][Extract<Last<T>, DigitsStr>]}` :
    never;

  module sub {
    type Indices = ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];
    type Map<T, N> = { [K in keyof T]: [T[K], N] };
    type Vec = [...Map<Indices, 0>, ...Map<Indices, 1>];
    type Vec2 = [Slice<Vec, 9, 19>, Slice<Vec, 8, 18>, Slice<Vec, 7, 17>, Slice<Vec, 6, 16>, Slice<Vec, 5, 15>,
                  Slice<Vec, 4, 14>, Slice<Vec, 3, 13>, Slice<Vec, 2, 12>, Slice<Vec, 1, 11>];
    type Vec3 = [[...Vec2,  Slice<Vec, 0, 10>], [Slice<Vec, 10, 20>, ...Vec2]];
    export type Type<L1 extends string, R1 extends string, Carry extends 0 | 1> =
      Vec3[Carry][Extract<L1, DigitsStr>][Extract<R1, DigitsStr>];
  }
  export type Sub<
    L extends string,
    R extends string,
    Carry extends 0 | 1,
    Sign extends '' | '-',
  > = R extends '' ? [`${Sign}${L}`, Dec<L, Sign>][Carry] :
      L extends '' ? never :
      Sub<RemoveLast<L>, RemoveLast<R>, sub.Type<Last<L>, Last<R>, Carry>[1], Sign> extends infer U ?
        `${Extract<U, string>}${Extract<sub.Type<Last<L>, Last<R>, Carry>[0], DigitsStr>}` :
      never;
}

export type Dec<T extends string> =
  T extends '0' | '1' ? ['-1', '0'][T] :
  T extends `-${infer T}` ? detail.Inc<T, '-'> :
  detail.Dec<T, ''>;

export type Sub<T extends string, U extends string> =
  T extends `-${infer T}` ?
    U extends `-${infer U}` ? detail.Sub<T, U, 0, '-'> | detail.Sub<U, T, 0, ''> :
    detail.Add<T, U, 0, '-'> :
  U extends `-${infer U}` ? detail.Add<T, U, 0, ''> :
  detail.Sub<T, U, 0, ''> | detail.Sub<U, T, 0, '-'>;

module detail {
  module div2 {
    // Mapped type と Flatten を駆使すれば生成できるが Flatten がこれに依存しているため使えない
    export type Quotient<Padding extends '' | '0'> = [
      Padding, Padding, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
    ];
    export type Complement = Tile<['', '1'], 10>;
    export type Padding<Padding extends '' | '0'> = [ Padding, Padding, ...MakeTuple<'0', 18> ];
    export type Keys = StringIndexSequence<20>[number];
  }
  export type Div2<N extends string, Carry extends '' | '1', Padding extends '' | '0'> =
    N extends '' ? '' :
    Div2<
      RemoveFirst<N>,
      div2.Complement[Extract<`${Carry}${First<N>}`, div2.Keys>],
      div2.Padding<Padding>[Extract<`${Carry}${First<N>}`, div2.Keys>]
    > extends infer U ?
      `${div2.Quotient<Padding>[Extract<`${Carry}${First<N>}`, div2.Keys>]}${Extract<U, string>}` :
    never;
}

export type Div2<N extends string> = detail.Div2<N, '', ''>;

export type Sum<T extends string[]> =
  T extends { length: 0 | 1 } ? T extends [ `${infer U}` ] ? U : '0' :
  Div2<`${T['length']}`> extends `${infer N}` ?
  Sum<Extract<Head<T, N>, string[]>> extends `${infer U}` ?
    Sum<Extract<Tail<T, N>, string[]>> extends `${infer V}` ?
    Add<U, V> :
  never : never : never;

module detail {
  module mul {
    type X<T extends string[], U extends string[]> = {
      [K in keyof T]: Add<Extract<T[K], string>, Extract<U[Extract<K, keyof U>], string>, 0, ''>;
    }
    type _0 = MakeTuple<'0', 10>;
    type _1 = StringIndexSequence<10>;
    type _2 = X<_1, _1>;
    type _4 = X<_2, _2>;
    type _8 = X<_4, _4>;
    type Table = [_0, _1, _2, X<_1, _2>, _4, X<_1, _4>, X<_2, _4>, X<_1, X<_2, _4>>, _8, X<_1, _8>];
    type Tenth<T extends string, N extends string> = T extends '0' | '-0' ? '0' : `${T}${MakeString<'0', N>}`;
    export type Type<L extends string[], R extends string[], Sign extends '' | '-'> = {
      [K1 in keyof L]: Sum<{
        [K2 in keyof R]: `${Sign}${Tenth<Table[Extract<L[K1], DigitsStr>][Extract<R[K2], DigitsStr>], Extract<K2, string>>}`;
      }>;
    } extends [...infer T] ? Sum<{ [K in keyof T]: Tenth<Extract<T[K], string>, Extract<K, string>> }> : never;
  }
  export type Mul<L extends string, R extends string, Sign extends '' | '-'> =
    mul.Type<ToReverseTuple<L, DigitsStr>, ToReverseTuple<R, DigitsStr>, Sign>;
}

type Mul<L extends string, R extends string> = 
  L extends `-${infer L}` ?
    R extends `-${infer R}` ? detail.Mul<L, R, ''> :
    detail.Mul<L, R, '-'> :
  R extends `-${infer R}` ? detail.Mul<L, R, '-'>:
  detail.Mul<L, R, ''>;

// @ts-ignore
interface _Test {
  inc: [
    Assert<Eq<Inc<'9'>, '10'>>,
    Assert<Eq<Inc<'-1'>, '0'>>,
    Assert<Eq<Inc<'-10'>, '-9'>>,
  ];
  dec: [
    Assert<Eq<Dec<'10'>, '9'>>,
    Assert<Eq<Dec<'0'>, '-1'>>,
    Assert<Eq<Dec<'1'>, '0'>>,
    Assert<Eq<Dec<'-9'>, '-10'>>,
  ];
  add: [
    Assert<Eq<Add<'1', '9'>, '10'>>,
    Assert<Eq<Add<'1', '8'>, '9'>>,
    Assert<Eq<Add<'28554', '66181'>, '94735'>>,
    Assert<Eq<Add<'28554', '-66181'>, '-37627'>>,
    Assert<Eq<Add<'-28554', '66181'>, '37627'>>,
    Assert<Eq<Add<'-28554', '-66181'>, '-94735'>>,
  ];
  sub: [
    Assert<Eq<Sub<'10', '1'>, '9'>>,
    Assert<Eq<Sub<'9', '1'>, '8'>>,
    Assert<Eq<Sub<'28554', '66181'>, '-37627'>>,
    Assert<Eq<Sub<'28554', '-66181'>, '94735'>>,
    Assert<Eq<Sub<'-28554', '66181'>, '-94735'>>,
    Assert<Eq<Sub<'-28554', '-66181'>, '37627'>>,
  ];
  sum: Assert<Eq<Sum<StringIndexSequence<100>>, '4950'>>;
  mul: [
    Assert<Eq<Mul<'28554', '66181'>, '1889732274'>>,
    Assert<Eq<Mul<'-28554', '66181'>, '-1889732274'>>,
    Assert<Eq<Mul<'28554', '-66181'>, '-1889732274'>>,
    Assert<Eq<Mul<'-28554', '-66181'>, '1889732274'>>,
    Assert<Eq<Mul<'28554', '0'>, '0'>>,
  ];
}
