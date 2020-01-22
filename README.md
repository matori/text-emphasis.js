[日本語](README.ja.md)

# text-emphasis.js

This library provides fake emphasis marks to browsers which does not support CSS `text-emphasis`, but supports HTML `ruby`.

## Notice

- This library does not affect browsers which does not support CSS `text-emphasis` nor HTML `ruby`.
- If target element has a `ruby` element, this library skips that element, because this library uses `ruby` elements for displaying emphasis marks. And if the target element itself is a `ruby` element, this library does do anything.
- If target element has a character using ZWJ (Zero Width Joiner) like `👨‍👩‍👧‍👦`, this library can not provide emphasis marks correctly.
  - In this case, load another text split library and specify it to `splitter` option.
- This library does not add fake emphasis to whitespaces ( `/\s/` ).

## Install

via npm.

```
npm install --save text-emphasis
```

or download this repository.

## Usage

```html
<script src="path/to/umd/text-emphasis.js"></script>
<script>
  new TextEmphasis.default({
    selector: 'em',
  })
</script>
```

### Options

#### `selector`: required

type: String

Target selector.

#### `emphasisSymbol`

type: String  
default: `"dot"`

Specifying emphasis mark. Choose from the following list.

- `"dot"`
- `"circle"`
- `"double-circle"`
- `"triangle"`
- `"sesame"`

#### `symbolStyle`

type: String  
default: `"filled"`

Specifying emphasis marks the style. Choose from the following list.

- `"filled"`
- `"open"`

#### `string`

type: String  
default: `""`

Specifying any character for emphasis marks it if you want. If this option is specified, `emphasisSymbol` and `symbolStyle` options will be ignored.

#### `color`

type: String  
default: `""`

Specifying emphasis marks color. If this option is not specified, emphasis marks will be contextual color.

#### `force`

type: Boolean  
default: `false`

**Not Recommend** to set `true`.

Force fake emphasis marks provided from this library to browsers which supports CSS `text-emphasis`, if that supports `ruby` element.

This option is prepared for development.  
Recommend using native CSS `text-emphasis` (or `-webkit-text-emphasis` ) for modern browsers in production, and this library is used for Internet Explorer 11 and old Microsoft Edge (EdgeHTML version).

#### `splitter`

type: Function  
default: `undefined`

Specifying text splitter function.  
If not specified, this library use native `Array.from` (or [core-js](https://github.com/zloirock/core-js) `Array.from` polyfill).

If you want to add emphasis marks to a character using ZWJ (Zero Width Joiner) like `👨‍👩‍👧‍👦` correctly, you need other library for this option,

##### Example: Use with [grapheme-splitter](https://github.com/orling/grapheme-splitter)

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

If set `true`, when a user start selection, all emphasis marks provided from this library will be invisible.

This library uses ruby for emphasis marks, but ruby text is user-selectable. This library add `(-webkit-, -ms-)user-select: none` to `rt` (ruby-text) element, but a user can select ruby text on Internet Explorer 11.

Because, CSS `-ms-user-select: none` (IE supports this) is different from `user-select: none`. `-ms-user-select: none` only stop selection started from the element.

#### `rubyClassName`

type: String  
default: `"js-textEmphasis-ruby"`

HTML `class` attribute value of generated `ruby` elements for fake emphasis.

#### `rtClassName`

type: String  
default: `"js-textEmphasis-rt"`

HTML `class` attribute value of generated `rt` elements for fake emphasis.

## Licence

MIT Licence