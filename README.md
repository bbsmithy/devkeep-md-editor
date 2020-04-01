# devkeep-md-editor

This is a work in progress markdown editor, contributions are very welcome!
The plan is to keep it very simple starting out with heading controls, code block, block-quote, ordered and unordered list controls.

The markdown parser i'm using is [markdown-it](https://github.com/markdown-it/markdown-it), so anything you can do with that you should be able to do here.
I'm going to try an write a markdown parser soon in Rust and compile to web assembly for this, because why not!

```javascript
import React from 'react';
import { render } from 'react-dom';
import { MarkdownEditor } from './lib';

const styles = {
  mainContainer: { backgroundColor: '#333' },
  markdownContainer: { color: '#333' },
  markdownEditor: { backgroundColor: '#333', color: 'white' },
  htmlContainer: { color: 'white' }
};

const App = () => {
  const onSave = (md, html) => {
    console.log(md, html);
  };

  const onDelete = () => {
    console.log('DELETE');
  };

  return (
    <MarkdownEditor
      height={700}
      styles={styles}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
};

render(<App />, document.getElementById('root'));
```
