# devkeep-md-editor

This is a work in progress markdown editor, contributions are very welcome!
The plan is to keep it very simple starting out with heading controls, code block, block-quote, ordered and unordered list controls.

The markdown parser i'm using is [showdown](https://github.com/showdownjs/showdown), so anything you can do with that you should be able to do here.

CMD+K toggle between markdown and rendered html

CMD+S to run save returning html and markdown

CMD+D to for delete control

```js
import React from 'react';
import { render } from 'react-dom';
import { MarkdownEditor } from './lib';

const styles = {
  mainContainer: { backgroundColor: '#333' },
  markdownContainer: { color: 'white' },
  markdownEditor: { backgroundColor: '#333', color: 'white' },
  htmlContainer: { color: 'white' }
};

const exmapleMD = `# Testing
Building a computer can be a very rewarding experience.
Since you’re reading this, you’re probably thinking about building your next computer instead of buying one pre-built.
This is a very viable option these days and can bring many benefits; you can learn a lot about computer hardware by building one, you get a totally personalized computer,
you can choose better components and you may be able to save some money and have fun.
`

const App = () => {
  const onSave = (md, html) => {
    console.log(md, html);
  };

  const onDelete = () => {
    console.log('DELETE');
  };

  return (
    <div style={{ margin: 'auto', width: '50%' }}>
      <MarkdownEditor
        height={700}
        initialContent={{ type: 'md', content: exmapleMD }}
        styles={styles}
        onSave={onSave}
        onDelete={onDelete}
      />
    </div>
  );
};

render(<App />, document.getElementById('root'));
```
![Markdown editor](https://github.com/bbsmithy/devkeep-md-editor/raw/master/screenshots/md.png "Markdown editor")
![Rendered html](https://github.com/bbsmithy/devkeep-md-editor/raw/master/screenshots/render.png "Rendered html")
