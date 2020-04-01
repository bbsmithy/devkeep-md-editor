import * as React from 'react';
import './MarkdownEditor.css';
import Controls from './Controls';

const MarkdownIt = require('markdown-it');

const mdIt = new MarkdownIt({
  html: true // Enable HTML tags in source
});

const titleControls = ['H1', 'H2', 'H3', 'H4'];

const MdEditor = props => {
  const [html, setHTML] = React.useState();
  const [md, setMD] = React.useState('');
  const [displayMD, setDisplayMD] = React.useState(true);
  const textarea = React.useRef(null);

  React.useEffect(() => {
    setTextAreaFocus(md.length);
    document.addEventListener('keydown', commandListener);
    return () => document.removeEventListener('keydown', commandListener);
  }, [displayMD]);

  const setTextAreaFocus = selectionEnd => {
    if (textarea.current) {
      textarea.current.focus();
      textarea.current.setSelectionRange(selectionEnd, selectionEnd);
    }
  };

  const commandListener = e => {
    const keyCode = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
    const cmdUsed = window.navigator.platform.match('Mac')
      ? e.metaKey
      : e.ctrlKey;
    const tabPressed = keyCode == 9 && !e.shiftKey && !e.ctrlKey && !e.altKey;
    if (
      (cmdUsed || tabPressed) &&
      (keyCode === 83 || keyCode === 68 || keyCode === 75 || keyCode === 9)
    ) {
      e.preventDefault();
      switch (keyCode) {
        case 83: {
          props.onSave(md, html);
          break;
        }
        case 68: {
          props.onDelete();
          break;
        }
        case 75: {
          setDisplayMD(!displayMD);
          break;
        }
        case 9: {
          insertTab();
          break;
        }
      }
    }
  };

  const insertTab = () => {
    if (textarea.current.setSelectionRange) {
      var sS = textarea.current.selectionStart;
      var sE = textarea.current.selectionEnd;
      const insertAfterText = textarea.current.value.substring(0, sS);
      const insertAfterTextWithTab = insertAfterText + '\t';
      const stateWithTab =
        insertAfterTextWithTab + textarea.current.value.substr(sE);
      setMD(stateWithTab);
      setTextAreaFocus(insertAfterTextWithTab.length);
    }
  };

  const saveMDAndHTMLState = markdown => {
    const html = createHTML(markdown);
    setHTML(html);
    setMD(markdown);
  };

  const createHTML = markdown => {
    return mdIt.render(markdown);
  };

  const onChangeMarkdown = evt => {
    saveMDAndHTMLState(evt.currentTarget.value);
  };

  const replaceHeadingMD = (heading, headingMDCode) => {
    const filteredHeading = heading.replace(/#/g, '').trim();
    const newHeading = `${headingMDCode} ${filteredHeading}`;
    return newHeading;
  };

  const titleTransform = (control, mdMark) => {
    const sStart = textarea.current.selectionStart;
    const sEnd = textarea.current.selectionEnd;

    const remainingTextBeforeSelection = textarea.current.value.substring(
      0,
      sStart
    );
    const selectedText = textarea.current.value.substring(sStart, sEnd);
    const remainingTextAfterSelection = textarea.current.value.substr(sEnd);

    if (titleControls.includes(control)) {
      const newHeading = replaceHeadingMD(selectedText, mdMark);
      const stateWithMDMark =
        remainingTextBeforeSelection + newHeading + remainingTextAfterSelection;
      saveMDAndHTMLState(stateWithMDMark);
    }
  };

  const codeTransform = () => {};

  const onSelectControl = evt => {
    const control = evt.currentTarget.value;

    switch (control) {
      case 'H1': {
        console.log('handle h1');
        titleTransform(control, '#');
        break;
      }
      case 'H2': {
        console.log('handle h2');
        titleTransform(control, '##');
        break;
      }
      case 'H3': {
        console.log('handle h3');
        titleTransform(control, '###');
        break;
      }
      case 'H4': {
        console.log('handle h4');
        titleTransform(control, '####');
        break;
      }
      case 'CODE': {
        console.log('handle code');
        // transform(control);
        break;
      }
      case 'BLOCKQUOTE': {
        console.log('handle blockqoute');
        // transform(control);
        break;
      }
      case 'OL': {
        console.log('handle ol');
        // transform(control);
        break;
      }
      case 'UL': {
        console.log('handle ul');
        // transform(control);
        break;
      }
      default: {
        console.log('NO CONTROL');
        // transform(control);
      }
    }
  };

  return (
    <>
      {displayMD && <Controls onSelectControl={onSelectControl} />}
      <div
        className='mainContainer'
        style={{
          height: props.height,
          ...props.styles.mainContainer
        }}
      >
        {displayMD && (
          <div
            className='markdownContainer'
            style={props.styles.markdownContainer}
          >
            <textarea
              className='markdownEditor'
              id='devkeep-md-textarea'
              style={props.styles.markdownEditor}
              onChange={onChangeMarkdown}
              value={md}
              ref={textarea}
            />
          </div>
        )}
        {!displayMD && (
          <div className='htmlContainer' style={props.styles.htmlContainer}>
            {html && <div dangerouslySetInnerHTML={{ __html: html }}></div>}
          </div>
        )}
      </div>
    </>
  );
};

export default MdEditor;
