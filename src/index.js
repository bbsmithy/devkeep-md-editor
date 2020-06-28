import React, { useState } from 'react';
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
    disabledBtnColor: '#333'
  },
  preview: { background: "#4b4747", color: "white", codeBlockBackground: 'black' },
  editor: { background: "#333", color: "white" },
  cursorColor: "white",
  height: "80vh"
}

const greenTheme = {
  toolbar: {
    background: "#2E8B57",
    color: "white",
    activeBtnBackground: "#242020",
    activeBtnColor: 'white',
    disabledBtnBackground: "gray",
    disabledBtnColor: '#333'
  },
  preview: { background: "#2E8B57", color: "white", codeBlockBackground: 'black' },
  editor: { background: "#2E8B57", color: "white" },
  cursorColor: "white",
  height: "80vh"
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
        highlightTheme="agate"
        theme={firstTheme ? darkTheme : greenTheme}
        toolbarOptions={toolbarOptions}
      />
      <button onClick={switchTheme}>Switch Theme</button>
    </div>

  );
};

render(<App />, document.getElementById('root'));
