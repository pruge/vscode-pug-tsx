## pug-tsx README

When using pug in the tsx document, the variable used is added after the document.

## Features

It works automatically when saving.

## Extension Settings

This extension contributes the following settings:

* `on-save` - defaults to true, run commands on save.
* `options` - [webpack-preprocessor-pug-tsx](https://www.npmjs.com/package/webpack-preprocessor-pug-tsx) options
* `commands`
  * `append-pug-variable` - command name for append variable used in pug.

## Options

- settings.json
```javascript
"pug-tsx.options": {
  "includes": string[],
  "replace": { [key: string]: string },
  "start": string[]
}
```

### `includes`

> type: `string[]`
>
> default: `['jsx', 'React']`

Variable that must be included among imported libs.

### `replace`

> type: `{[key: string]: string}`
>
> default: `{'jsx': '/** @jsx jsx */ jsx'}`

When you need to transform the variable declared in includes.

```javascript
"pug-tsx.options": {
  "replace": {
    "jsx": "/** @jsx jsx */ jsx"
  }
}
```

### `start`

```
> type: string[]
>
> default: ['pug`', 'css`', ' `[^;,]', '\\(`']
```

Specifies the starting string of the element containing the backtick.
Expressed as a regular expression string.

```
- pug` is the starting string of pug.
- css` is the starting string for emotion css.
-  `[^;] is the starting string for template strings.
```

## Caveats

### The starting element of the backtick-wrapped phrase should be added to the start of options.

The following code may not work as expected:

```javascript
const Button = styled.button`
  color: turquoise;
`;

render pug`
  Button This my button component.
`;
```

So, you need to add the following to the start of options.

```javascript
"pug-tsx.options": {
  "start": ["button`"]
}
```

### There is no need to include `/** @jsx jsx */` in the document.

The following code is added automatically.

before

```javascript
import { jsx, css } from '@emotion/core';
```

after

```javascript
/** @jsx jsx */ jsx;
import { jsx, css } from '@emotion/core';
```



## Release Notes

Users appreciate release notes as you update your extension.

### 0.1.0

Initial release


-----------------------------------------------------------------------------------------------------------
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
