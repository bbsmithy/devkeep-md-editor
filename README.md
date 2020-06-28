# devkeep-md-editor
React markdown editor component thats uses SimpleMde and Highlight.js under the hood.

## Install
```bash 
npm install devkeep-md-editor
```
or
```bash
yarn add devkeep-md-editor
```

## Props

| Prop | Description | Type |
|--------|--------|----|
|`initialValue`|The initial markdown string|string|
|`onSave`|Called when (CMD/CTRL+S) is pressed with markdown string  as a callback param|function|
|`onDelete`|Called when (CMD/CTRL+D) is pressed|function|
|`codeMirrorHandle`|Called when codemirror editor instance is available, you can use this to listen to code mirror events and manipulate content directly |function|
|`localSaveId`|Used as key for saving markdown to local storage|function|
|`useSpellChecker`|Enable spellchecker on editor, will highlight mis-spellings in red|bool|
|`useHighlightJS`|Enabling will add highlight.js script to the page|bool|
|`highlightTheme`|Highlight.js theme to use - will add a css link tag with theme from highlight to page|string|
|`theme`|This is theme object you can use to style toolbar, editor and preview parts, see below for options|object|
|`toolbarOptions`|Toolbar icons to display see [simplemde docs](https://github.com/sparksuite/simplemde-markdown-editor#toolbar-icons) for options|array|


### Example theme object:
```js
{
  toolbar: {
    background: "#333",
    color: "white",
    activeBtnBackground: "#242020",
    activeBtnColor: 'white',
    disabledBtnBackground: "gray",
    disabledBtnColor: '#333'
  },
  preview: { background: "green", color: "white", codeBlockBackground: 'black' },
  editor: { background: "#333", color: "white" },
  cursorColor: "white",
  height: "87vh"
}
```

## Example
Demo: 
```jsx
import React, { useState } from 'react';
import { render } from 'react-dom';
import { MarkdownEditor } from './lib';

const exmapleMD = `
# Intro
Go ahead, play around with the editor! Be sure to check out **bold** and *italic* styling, or even [links](https://google.com). You can type the Markdown syntax, use the toolbar, or use shortcuts like `cmd-b` or `ctrl-b`.

## Lists
Unordered lists can be started using the toolbar or by typing `* `, `- `, or `+ `. Ordered lists can be started by typing `1. `.

#### Unordered
* Lists are a piece of cake
* They even auto continue as you type
* A double enter will end them
* Tabs and shift-tabs work too

#### Ordered
1. Numbered lists...
2. ...work too!

## What about images?
![Yes](https://i.imgur.com/sZlktY7.png)
`

const theme = {
  toolbar: {
    background: "#333",
    color: "white",
    activeBtnBackground: "#242020",
    activeBtnColor: 'white',
    disabledBtnBackground: "gray",
    disabledBtnColor: '#333'
  },
  preview: { background: "#4b4747", color: "white", codeBlockBackground: 'black' },
  editor: { background: "#333", color: "white" },
  cursorColor: "white",
  height: "87vh"
}

const secondTheme = {
  toolbar: {
    background: "green",
    color: "white",
    activeBtnBackground: "#242020",
    activeBtnColor: 'white',
    disabledBtnBackground: "gray",
    disabledBtnColor: '#333'
  },
  preview: { background: "green", color: "black", codeBlockBackground: 'black' },
  editor: { background: "#333", color: "white" },
  cursorColor: "white",
  height: "87vh"
}

const toolbarOptions = [
  'bold',
  'italic',
  'heading',
  '|',
  'quote',
  'ordered-list',
  'unordered-list',
  '|',
  'code',
  'link',
  'image',
  'table',
  '|',
  'preview',
  'fullscreen',
  'side-by-side',
  '|',
];

const App = () => {

  const [md, setMd] = useState(exmapleMD);
  const [firstTheme, setFirstTheme] = useState(true);

  const switchTheme = () => {
    setFirstTheme(!firstTheme)
  }

  // Called on (CMD/CRTL+S)
  const onSave = (markdown) => {
    setMd(markdown)
  };

  // Called on (CMD/CRTL+D)
  const onDelete = () => {
    console.log('DELETE');
  };

  // This handle returns the codemirror instance you can use to listen to events.
  // And manipulate content directly. It is called as soon as codemirror is available.
  const codeMirrorHandle = (cm) => {
    console.log(cm)
  }

  return (
    <div style={{ width: "60%", margin: "auto" }}>
      <MarkdownEditor
        initialValue={md}
        onSave={onSave}
        onDelete={onDelete}
        codeMirrorHandle={codeMirrorHandle}
        useSpellChecker={false}
        useHighlightJS
        highlightTheme={firstTheme ? "agate" : "zenburn"}
        theme={firstTheme ? theme : secondTheme}
        toolbarOptions={toolbarOptions}
      />
      <button onClick={switchTheme}>Switch Theme</button>
    </div>

  );
};

render(<App />, document.getElementById('root'));
```
