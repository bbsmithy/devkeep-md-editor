# devkeep-md-editor
React markdown editor component thats uses SimpleMde and Highlight.js under the hood.
Designed to allow customizable theme.

### [View live demo here](https://bsmithdev.netlify.app/devkeep-md-editor)
### [Follow me on twitter for updates](https://twitter.com/BSmithy77)

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
|`defaultView`|The default state to display the editor in, one of "fullscreen", "preview", "side-by-side" (fullscreen and side-by-side are not available on mobile views) |string|
|`title`| Title to display above editor |string|
|`editTitleWidth`| Width css value |string|
|`onEditTitle`| Pass this prop to render title as input, when changed will fire event with new title value |function|
|`autoFocusEditTitle`| Auto focus the edit title on render |boolean|
|`onBack`|Function to be called when back button is clicked|function|


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
Demo: https://bsmithdev.netlify.app/devkeep-md-editor
```jsx
import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { MarkdownEditor } from './lib';

const exmapleMD = `# Intro
Go ahead, play around with the editor! Be sure to check out **bold** and *italic* styling, or even [links](https://google.com). You can type the Markdown syntax, use the toolbar, or use shortcuts like \`cmd-b\` or \`ctrl - b\`.

## Code blocks

\`\`\`javascript
for (i = 0, len = cars.length, text = ""; i < len; i++) {
  text += cars[i] + "<br>";
}
\`\`\`

## Lists
Unordered lists can be started using the toolbar or by typing \`* \`, \` - \`, or \` + \`. Ordered lists can be started by typing \`1. \`.

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

const darkTheme = {
  toolbar: {
    background: "#333",
    color: "white",
    activeBtnBackground: "#242020",
    activeBtnColor: 'white',
    disabledBtnBackground: "gray",
    disabledBtnColor: '#333',
  },
  preview: { background: "#333", color: "white", codeBlockBackground: 'black' },
  editor: { background: "#333", color: "white" },
  cursorColor: "white",
  height: "85vh"
}

const greenTheme = {
  toolbar: {
    background: "green",
    color: "white",
    activeBtnBackground: "#242020",
    activeBtnColor: 'white',
    disabledBtnBackground: "gray",
    disabledBtnColor: '#333'
  },
  preview: { background: "green", color: "white", codeBlockBackground: 'black' },
  editor: { background: "green", color: "white" },
  cursorColor: "white",
  height: "85vh"
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

  const [firstTheme, setFirstTheme] = useState(true);
  const cmRef = useRef()
  const simpleMDERef = useRef()

  // Example of using simpleMDE object to change to edit mode from preview when
  // Editor container is double clicked
  const changePreviewToEdit = () => {
    if (simpleMDERef.current.isPreviewActive()) {
      simpleMDERef.current.togglePreview()
    }
  }

  const switchTheme = () => {
    setFirstTheme(!firstTheme)
  }

  // Called on (CMD/CRTL+S)
  const onSave = (markdown) => {
    console.log(markdown)
    alert('SAVE');
  };

  // Called on (CMD/CRTL+D)
  const onDelete = () => {
    alert('DELETE');
  };

  // This handle returns the codemirror instance you can use to listen to events.
  // And manipulate content directly. It is called as soon as codemirror is available.
  const codeMirrorHandle = (cm) => {
    cmRef.current = cm
  }

  // This handle returns the simpleMDE instance object
  // See https://github.com/sparksuite/simplemde-markdown-editor#useful-methods
  // For how you can use this
  const simpleMDEHandle = (simpleMDE) => {
    simpleMDERef.current = simpleMDE
  }

  return (
    <div
      style={{ width: "60%", margin: "auto" }}
      onDoubleClick={changePreviewToEdit}
    >
      <MarkdownEditor
        initialValue={exmapleMD}
        onSave={onSave}
        onDelete={onDelete}
        codeMirrorHandle={codeMirrorHandle}
        simplemdeHandle={simpleMDEHandle}
        useSpellChecker={false}
        useHighlightJS
        highlightTheme="agate"
        theme={firstTheme ? darkTheme : greenTheme}
        toolbarOptions={toolbarOptions}
        defaultView={"side-by-side"}
        title={"This is a demo"}
        onBack={()=> alert('Go back')}
      />
      <button onClick={switchTheme}>Switch Theme</button>
    </div>

  );
};

render(<App />, document.getElementById('root'));
```
