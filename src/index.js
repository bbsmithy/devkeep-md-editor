import React from 'react';
import { render } from 'react-dom';
import { MarkdownEditor } from './lib';

const exmapleMD = `
# Hello
Building a computer can be a very rewarding experience. Since you’re reading this, you’re probably thinking about building your next computer instead of buying one pre-built. This is a very viable option these days and can bring many benefits; you can learn a lot about computer hardware by building one, you get a totally personalized computer, you can choose better components and you may be able to save some money and have fun.
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
  preview: { background: "#4f4d4d", color: "white", codeBlockBackground: 'black' },
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
    <div style={{ width: "60%", margin: "auto" }}>
      <MarkdownEditor
        initialValue={exmapleMD}
        onSave={onSave}
        onDelete={onDelete}
        codeMirrorHandle={codeMirrorHandle}
        localSaveId="devkeep-save-1"
        useSpellChecker={false}
        useHighlightJS
        highlightTheme="agate"
        theme={theme}
      />
    </div>

  );
};

render(<App />, document.getElementById('root'));
