import './integer';
import * as util from '../util';

export type Digits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type DigitsStr = `${Digits}`

export type First<T extends string> = util.First<T, DigitsStr>;
export type RemoveFirst<T extends string> = util.RemoveFirst<T, DigitsStr>;
export type Last<T extends string> = util.Last<T, DigitsStr>;
export type RemoveLast<T extends string> = util.RemoveLast<T, DigitsStr>;
