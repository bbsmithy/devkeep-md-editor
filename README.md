# devkeep-md-editor

```import { MarkdownEditor } from 'devkeep-md-editor';```

- CMD/CTRL+S to run save returning markdown
- CMD/CTRL+D to for delete control
- CMD/CTRL+O to return underlining ```codemirror``` object which you can use to edit content and read properties [CodeMirror docs](https://codemirror.net/doc/manual.html)

Follow me on twitter for updates [@BSmithy77](https://twitter.com/BSmithy77)

```js
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

const App = () => {

  // CMD/CTRL+S to run save returning markdown
  const onSave = (md) => {
    console.log(md);
  };

  // CMD/CTRL+D to for delete control
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
      />
    </div>
  );
};

render(<App />, document.getElementById('root'));
```
![Markdown editor](https://github.com/bbsmithy/devkeep-md-editor/raw/master/screenshots/md.png "Markdown editor")
![Rendered html](https://github.com/bbsmithy/devkeep-md-editor/raw/master/screenshots/render.png "Rendered html")
