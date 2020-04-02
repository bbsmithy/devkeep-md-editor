import * as React from 'react';
import './MarkdownEditor.css';
import Controls from './Controls';

const MarkdownIt = require('markdown-it');

const mdIt = new MarkdownIt({
  html: true // Enable HTML tags in source
});

const codeBackTicks = '```';

const MdEditor = props => {
  const [html, setHTML] = React.useState();
  const [md, setMD] = React.useState('');
  const [displayMD, setDisplayMD] = React.useState(true);
  const textarea = React.useRef(null);
  const [codeLang, setCodeLang] = React.useState('');

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

  const getSelectionState = () => {
    const sStart = textarea.current.selectionStart;
    const sEnd = textarea.current.selectionEnd;
    const textBeforeSelection = textarea.current.value.substring(0, sStart);
    const selectedText = textarea.current.value.substring(sStart, sEnd);
    const textAfterSelection = textarea.current.value.substr(sEnd);

    return { textBeforeSelection, selectedText, textAfterSelection };
  };

  const replaceHeadingMD = (heading, headingMDCode) => {
    const filteredHeading = heading.replace(/#/g, '').trim();
    const newHeading = `${headingMDCode} ${filteredHeading}`;
    return newHeading;
  };

  const titleTransform = mdMark => {
    const {
      textBeforeSelection,
      selectedText,
      textAfterSelection
    } = getSelectionState();
    const newHeading = replaceHeadingMD(selectedText, mdMark);
    const stateWithMDMark =
      textBeforeSelection + newHeading + textAfterSelection;
    saveMDAndHTMLState(stateWithMDMark);
  };

  const codeTransform = () => {
    const {
      textBeforeSelection,
      selectedText,
      textAfterSelection
    } = getSelectionState();
    const selectedTextAsCodeBlock =
      `${codeBackTicks}${codeLang}` +
      '\n' +
      selectedText +
      '\n' +
      `${codeBackTicks}`;
    console.log(selectedText);
    const stateWithCodeBlock =
      textBeforeSelection + selectedTextAsCodeBlock + textAfterSelection;
    saveMDAndHTMLState(stateWithCodeBlock);
  };

  const onSelectControl = evt => {
    const control = evt.currentTarget.value;

    switch (control) {
      case 'H1': {
        titleTransform('#');
        break;
      }
      case 'H2': {
        titleTransform('##');
        break;
      }
      case 'H3': {
        titleTransform('###');
        break;
      }
      case 'H4': {
        titleTransform('####');
        break;
      }
      case 'CODE': {
        codeTransform();
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

  const onChangeLanguage = lang => {
    setCodeLang(lang);
  };

  return (
    <>
      {displayMD && (
        <Controls
          onSelectControl={onSelectControl}
          onChangeLanguage={onChangeLanguage}
        />
      )}
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
