# Chertan

TypeScript metaprogramming library

## What's this

TypeScript の型レベル計算を行うライブラリです。  
このライブラリ内の定義は型及び型計算に必要な実体のないオブジェクトの宣言　(`unique symbol` など)
に限られ、実行時に影響する処理は一切存在しません。  
コンパイル時間が爆発したりコンパイラが落ちたりする可能性はあります。  

## 動作環境

[Template string types](https://github.com/microsoft/TypeScript/pull/40336) がないと動きません。  
現時点(2020/9/13) 、動かすには `typescript@4.1.0-dev.20200910` 以上が必要です。
