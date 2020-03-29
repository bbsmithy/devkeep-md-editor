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
