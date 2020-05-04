import React from 'react';
import { render } from 'react-dom';
import { MarkdownEditor } from './lib';

const styles = {
  mainContainer: { backgroundColor: '#333' },
  markdownContainer: { color: 'white' },
  markdownEditor: { backgroundColor: '#333', color: 'white' },
  htmlContainer: { color: 'white' },
  controlsContainer: {
    backgroundColor: ''
  },
  controlButton: {
    backgroundColor: '#333'
  }
};

const exmapleMD = `# Hello

Building a computer can be a very rewarding experience. Since you’re reading this, you’re probably thinking about building your next computer instead of buying one pre-built. This is a very viable option these days and can bring many benefits; you can learn a lot about computer hardware by building one, you get a totally personalized computer, you can choose better components and you may be able to save some money and have fun.

Additionally, if you are the sort of person who wants to understand how things work, if you take broken stuff apart just to see how it all fits together, if you have a drawer somewhere full of “parts” you think may come in handy someday, then you just may be in the right place.

*Test*`

const App = () => {
  const onSave = (md, html) => {
    console.log(md, html);
  };

  const onDelete = () => {
    console.log('DELETE');
  };

  return (
    <div style={{ margin: 'auto', width: '60%' }}>
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
