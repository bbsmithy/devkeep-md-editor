import React from 'react';
import { render } from 'react-dom';
import { MarkdownEditor } from './lib';

const exmapleMD = `# Hello

Building a computer can be a very rewarding experience. Since you’re reading this, you’re probably thinking about building your next computer instead of buying one pre-built. This is a very viable option these days and can bring many benefits; you can learn a lot about computer hardware by building one, you get a totally personalized computer, you can choose better components and you may be able to save some money and have fun.

Additionally, if you are the sort of person who wants to understand how things work, if you take broken stuff apart just to see how it all fits together, if you have a drawer somewhere full of “parts” you think may come in handy someday, then you just may be in the right place.

*Test*

# Hello

Building a computer can be a very rewarding experience. Since you’re reading this, you’re probably thinking about building your next computer instead of buying one pre-built. This is a very viable option these days and can bring many benefits; you can learn a lot about computer hardware by building one, you get a totally personalized computer, you can choose better components and you may be able to save some money and have fun.

Additionally, if you are the sort of person who wants to understand how things work, if you take broken stuff apart just to see how it all fits together, if you have a drawer somewhere full of “parts” you think may come in handy someday, then you just may be in the right place.

*Test*

`

const theme = { background: "#333", color: "white" }
const toolbarTheme = { background: "#333", color: "white", activeBtnBackground: "#242020", activeBtnColor: 'white' }

const App = () => {

  const onSave = (md) => {
    console.log(md);
  };

  const onDelete = () => {
    console.log('DELETE');
  };

  const onOpenInsert = (cm) => {
    console.log(cm.doc.getCursor());
  }

  return (
    <div style={{ margin: 'auto', width: '60%' }}>
      <MarkdownEditor
        initialValue={exmapleMD}
        onSave={onSave}
        onDelete={onDelete}
        onOpenInsert={onOpenInsert}
        localSaveId="devkeep-save-1"
        editorTheme={theme}
        previewTheme={theme}
        toolbarTheme={toolbarTheme}
      />
    </div>
  );
};

render(<App />, document.getElementById('root'));
