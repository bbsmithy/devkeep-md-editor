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
}
```

## Example
Demo: 
```jsx
import React from 'react';
import { render } from 'react-dom';
import { MarkdownEditor } from 'devkeep-md-editor';

const exmapleMD = `md
# Hello

Building a computer can be a very rewarding experience. Since you’re reading this, you’re probably thinking about building your next computer instead of buying one pre-built.
This is a very viable option these days and can bring many benefits; you can learn a lot about computer hardware by building one, you get a totally personalized computer, you can choose better components and you may be able to save some money and have fun.

Additionally, if you are the sort of person who wants to understand how things work, if you take broken stuff apart just to see how it all fits together, if you have a drawer somewhere full of “parts” you think may come in handy someday, then you just may be in the right place.

*Test*

# Hello

Building a computer can be a very rewarding experience. Since you’re reading this, you’re probably thinking about building your next computer instead of buying one pre-built. This is a very viable option these days and can bring many benefits; you can learn a lot about computer hardware by building one, you get a totally personalized computer, you can choose better components and you may be able to save some money and have fun.

Additionally, if you are the sort of person who wants to understand how things work, if you take broken stuff apart just to see how it all fits together, if you have a drawer somewhere full of “parts” you think may come in handy someday, then you just may be in the right place.

*Test*

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
  preview: { background: "#474646", color: "white" },
  editor: { background: "#333", color: "white" },
  cursorColor: "white",
}

const App = () => {

  // Called on (CMD/CRTL+S)
  const onSave = (md) => {
    console.log(md);
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
      <MarkdownEditor
        initialValue={exmapleMD}
        onSave={onSave}
        onDelete={onDelete}
        codeMirrorHandle={codeMirrorHandle}
        localSaveId="devkeep-save-1"
        spellChecker={false}
        useHighlightJS
        theme={theme}
      />
  );
};

render(<App />, document.getElementById('root'));
```
