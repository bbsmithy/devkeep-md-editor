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
        onEditTitle={(val) => {alert(val)}}
        editTitleWidth={"50%"}
        onBack={()=> alert('Go back')}
      />
      <button onClick={switchTheme}>Switch Theme</button>
    </div>

  );
};

render(<App />, document.getElementById('root'));
