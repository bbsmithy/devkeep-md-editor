import React from 'react';
import { render } from 'react-dom';
import { MarkdownEditor } from './lib';

const styles = {
  mainContainer: { backgroundColor: '#333' },
  markdownContainer: { color: '#333' },
  markdownEditor: { backgroundColor: '#333', color: 'white' },
  htmlContainer: { color: 'white' }
};

const App = () => <MarkdownEditor text='hello' height={700} styles={styles} />;

render(<App />, document.getElementById('root'));
