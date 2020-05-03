import * as React from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-dark.css';
import Controls from './Controls';
import './MarkdownEditor.css';

const showdown = require('showdown');

const sd = new showdown.Converter();



sd.addExtension(() => {
  return [{
    type: "output",
    filter: function (text, converter, options) {
      var left = "<pre><code\\b[^>]*>",
        right = "</code></pre>",
        flags = "g";
      var replacement = function (wholeMatch, match, left, right) {
        var lang = (left.match(/class=\"([^ \"]+)/) || [])[1];
        left = left.slice(0, 18) + 'hljs ' + left.slice(18);
        if (lang && hljs.getLanguage(lang)) {
          return left + hljs.highlight(lang, match).value + right;
        } else {
          return left + hljs.highlightAuto(match).value + right;
        }
      };
      return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
    }
  }];
})

const codeBackTicks = '```';

const MdEditor = props => {
  const [html, setHTML] = React.useState();
  const [md, setMD] = React.useState('');
  const [displayMD, setDisplayMD] = React.useState(true);
  const textarea = React.useRef(null);
  const [codeLang, setCodeLang] = React.useState('');

  React.useEffect(() => {
    setInitialContent();
  }, [])

  React.useEffect(() => {
    setTextAreaFocus(md.length);
    document.addEventListener('keydown', commandListener);
    return () => document.removeEventListener('keydown', commandListener);
  }, [displayMD]);

  const setInitialContent = () => {
    const { type, content } = props.initialContent
    if (type === 'html') {
      setHTML(content);
      const newMarkdown = sd.makeMarkdown(content);
      setMD(newMarkdown);
    } else if (type === 'md') {
      setMD(content);
      const newHtml = sd.makeHtml(content);
      setHTML(newHtml);
    }
  }

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
    const tabPressed = keyCode === 9 && !e.shiftKey && !e.ctrlKey && !e.altKey;
    const returnPressed = keyCode === 13;
    const cmdKey = keyCode === 83 || keyCode === 68 || keyCode === 75;
    if (cmdUsed && cmdKey) {
      e.preventDefault();
      cmdAction(keyCode);
    } else if (tabPressed || returnPressed) {
      e.preventDefault();
      formattingAction(keyCode);
    }
  };

  // cmd/ctrl (save(CMD+S), delete(CMD+D), toogle md/html(CMD+K)) handler
  const cmdAction = keyCode => {
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
      default:
        break;
    }
  };

  // Tab or new line handler
  const formattingAction = keyCode => {
    switch (keyCode) {
      case 9: {
        insertTab();
        break;
      }
      case 13: {
        insertNewLine();
        break;
      }
      default:
        break;
    }
  };

  const insertTab = () => {
    if (textarea.current.setSelectionRange) {
      var sS = textarea.current.selectionStart;
      var sE = textarea.current.selectionEnd;
      const insertAfterText = textarea.current.value.substring(0, sS);
      const insertAfterTextWithTab = insertAfterText + '   ';
      const stateWithTab =
        insertAfterTextWithTab + textarea.current.value.substr(sE);
      setMD(stateWithTab);
      setTextAreaFocus(insertAfterTextWithTab.length);
    }
  };

  const insertNewLine = () => {
    // This will check the previous line for indentation
    // and then add the same indentation to the new line
    const { textBeforeSelection, textAfterSelection } = getSelectionState();
    const currentLine = getCurrentLine();
    const indent = currentLine.match(/^\s*/)[0];
    const textBeforeWithIndent = textBeforeSelection + '\n' + indent;
    const stateWithNewLine = textBeforeWithIndent + textAfterSelection;
    saveMDAndHTMLState(stateWithNewLine);
    setTextAreaFocus(textBeforeWithIndent.length);
  };

  const saveMDAndHTMLState = markdown => {
    const html = createHTML(markdown);
    setHTML(html);
    setMD(markdown);
  };

  const createHTML = markdown => {
    return sd.makeHtml(markdown);
  };

  const onChangeMarkdown = evt => {
    saveMDAndHTMLState(evt.currentTarget.value);
  };

  const getCurrentLine = () => {
    const sStart = textarea.current.selectionStart;
    return textarea.current.value
      .substr(0, sStart)
      .split('\n')
      .pop();
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

  const blockqouteTransform = () => {
    const {
      textBeforeSelection,
      selectedText,
      textAfterSelection
    } = getSelectionState();

    let selectedTextWithQuoteBlock = '';
    selectedText.split('\n').forEach(line => {
      selectedTextWithQuoteBlock += `>${line} \n`;
    });
    const stateWithQuoteBlock =
      textBeforeSelection + selectedTextWithQuoteBlock + textAfterSelection;
    saveMDAndHTMLState(stateWithQuoteBlock);
  };

  const textStyleTransform = style => {
    const {
      textBeforeSelection,
      selectedText,
      textAfterSelection
    } = getSelectionState();
    const selectedTextWithStyle = `${style}${selectedText}${style}`;
    const stateWithStyledBlock =
      textBeforeSelection + selectedTextWithStyle + textAfterSelection;
    saveMDAndHTMLState(stateWithStyledBlock);
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
        blockqouteTransform();
        break;
      }
      case 'BOLD': {
        textStyleTransform('**');
        break;
      }
      case 'ITALIC': {
        textStyleTransform('*');
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
        {!displayMD && html && (
          <div className='htmlContainer' style={props.styles.htmlContainer} dangerouslySetInnerHTML={{ __html: html }}></div>
        )}
      </div>
    </>
  );
};

export default MdEditor;
