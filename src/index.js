import React from 'react';
import { render } from 'react-dom';
import { MarkdownEditor } from './lib';

const styles = {
  mainContainer: { backgroundColor: '#333' },
  markdownContainer: { color: 'white' },
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
    <div style={{ margin: 'auto', width: '50%' }}>
      <MarkdownEditor
        height={700}
        styles={styles}
        onSave={onSave}
        onDelete={onDelete}
      />
    </div>
  );
};

render(<App />, document.getElementById('root'));
