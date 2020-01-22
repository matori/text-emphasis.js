[English](README.md)

# text-emphasis.js

このライブラリは、CSS `text-emphasis` をサポートしていない、かつ、HTML `ruby` 要素をサポートしているブラウザに、擬似的に圏点を提供します。

## 注意事項

- CSS `text-emphasis` もHTML `ruby` もサポートしていないブラウザに対しては何も行いません。
- ターゲット要素内に `ruby` 要素が存在する場合、その部分はスキップされます。このライブラリは `ruby` 要素を使うことによって圏点を再現してるからです。また、ターゲット要素自身が `ruby` 要素の場合、このライブラリは何も行いません。
- ターゲット要素内に `👨‍👩‍👧‍👦` のようなZWJ（Zero Width Joiner）を用いた合字が存在する場合、正常に疑似圏点が付与されません。
  - そのような場合、別の文字列分割ライブラリを読み込んで `splitter` オプションに指定する必要があります。
- このライブラリは空白文字（正規表現 `\s` にマッチする文字）に対しては圏点を提供しません。

## 使い方

```html
<script src="path/to/umd/text-emphasis.js"></script>
<script>
  new TextEmphasis.default({
    selector: 'em',
  })
</script>
```

### オプション

#### `selector`: 必須

type: String

ターゲットのセレクタです。

#### `emphasisSymbol`

type: String
default: `"dot"`

圏点のタイプを指定します。指定可能な文字列は以下のリストから選択できます。

- `"dot"`
- `"circle"`
- `"double-circle"`
- `"triangle"`
- `"sesame"`

#### `symbolStyle`

type: String
default: `"filled"`

圏点のスタイルを指定します。指定可能な文字列は以下のリストから選択できます。

- `"filled"`
- `"open"`

#### `string`

type: String
default: `""`

Specifying any character for emphasis marks it if you want. If this option is specified, `emphasisSymbol` and `symbolStyle` options will be ignored.

何らかの文字を圏点として用いたい場合に文字を指定します。このオプションが指定された場合、 `emphasisSymbol` と `symbolStyle` のオプションは無視されます。

#### `color`

type: String
default: `""`

圏点の色をCSSで指定可能な値で指定します。このオプションが指定されていない場合、圏点は文脈に応じた色になります。

#### `force`

type: Boolean
default: `false`

`true` にすることは**おすすめしません**。

CSS `text-emphasis` をサポートしているブラウザであっても、`ruby` 要素がサポートされていれば、このライブラリによる擬似圏点を強制的に提供します。

このオプションは開発用に用意されています。
このライブラリを使ったページを公開する場合、ネイティブのCSSを `text-emphasis` (または `-webkit-text-emphasis` )を使用し、ライブラリの対象はInternet Explorer 11や古いMicrosoft Edge (EdgeHTML版)などのような古いブラウザのみにすることをおすすめします。

#### `splitter`

type: Function
default: `undefined`

文字列分割用の関数を指定します。
指定されていない場合、ネイティブの `Array.from` （または [core-js](https://github.com/zloirock/core-js) の `Array.from` polyfill ）が使用されます。

`👨‍👩‍👧‍👦` のようなZWJ（Zero Width Joiner）を用いた合字が存在する場合にも正しく疑似圏点を付与したい場合、このオプションに別のライブラリを指定する必要があります。

##### 例: [grapheme-splitter](https://github.com/orling/grapheme-splitter) とともに使う場合

```html
<script src="path/to/umd/text-emphasis.js"></script>
<script src="path/to/grapheme-splitter/index.js"></script>
<script>
  const splitter = new GraphemeSplitter()
  new TextEmphasis.default({
    selector: 'em',
    splitter: splitter.splitGraphemes.bind(splitter),
  })
</script>
```

#### `hideEmphasisSelection`

type: Boolean
default: `false`

`true` が指定された場合、ユーザーがテキストを選択し始めたときにすべての疑似圏点を非表示にします。

このライブラリは `ruby` 要素を使って擬似的に圏点を提供しますが、ルビ文字列はユーザーが選択可能です。ライブラリはルビ文字列である `rt` 要素にたいして `(-webkit-, -ms-)user-select: none` を指定しますが、Internet Explorer 11に置いては、それらの文字も選択できてしまいます。
その理由は、IEがサポートしている `-ms-user-select: none` が `user-select: none` とは異なるからです。 `-ms-user-select: none` は、ユーザーがその要素から文字列を選択することを防ぐのみで、前後の範囲からスタートしてその要素に選択範囲が侵入してくることに対しては無力です。

#### `rubyClassName`

type: String
default: `"js-textEmphasis-ruby"`

ライブラリが生成する `ruby` 要素に付与されるクラス名です。

#### `rtClassName`

type: String
default: `"js-textEmphasis-rt"`

ライブラリが生成する `rt` 要素に付与されるクラス名です。

## ライセンス

MIT Licence