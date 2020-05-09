import React from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-dark.css';
import Controls from './Controls';
import { createUseStyles } from 'react-jss';

const decodeHtml = require("html-encoder-decoder").decode
const classAttr = 'class="';
const codeBackTicks = '```';
const showdown = require('showdown');
const sd = new showdown.Converter();
sd.addExtension(() => {
  return [{
    type: "output",
    filter(text, converter, options) {
      const left = "<pre><code\\b[^>]*>"
      const right = "</code></pre>"
      const flags = "g"
      const replacement = (wholeMatch, match, left, right) => {
        match = decodeHtml(match);
        let lang = (left.match(/class=\"([^ \"]+)/) || [])[1];

        if (left.includes(classAttr)) {
          let attrIndex = left.indexOf(classAttr) + classAttr.length;
          left = left.slice(0, attrIndex) + 'hljs ' + left.slice(attrIndex);
        } else {
          left = left.slice(0, -1) + ' class="hljs">';
        }

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

const useStyles = createUseStyles(() => ({
  mainContainer: {
    width: '100%',
    fontFamily: 'Arial, Helvetica, sans-serif',
    '& h1, h2, h3, h4, h5, p': {
      margin: 0,
      padding: 10
    },
    '& blockquote': {
      background: '#333',
      borderLeft: '5px solid #ccc',
      margin: '0.3em 10px',
      padding: '0.5em 0px 0.5em 10px',
      '& p': {
        display: 'inline'
      }
    },
    '& code': {
      '& span': {
        lineHeight: 1.3
      }
    }
  },
  markdownContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  htmlContainer: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    '& img': {
      maxWidth: '100%'
    }
  },
  markdownEditor: {
    width: '98%',
    height: '100%',
    margin: 'auto',
    padding: '1%',
    fontSize: 14,
    border: 'none',
    resize: 'none',
    '&:focus': {
      outline: 'none'
    }
  }
}))



const MdEditor = props => {
  const [html, setHTML] = React.useState();
  const [md, setMD] = React.useState('');
  const [displayMD, setDisplayMD] = React.useState(true);
  const textarea = React.useRef(null);
  const [codeLang, setCodeLang] = React.useState('');

  const classes = useStyles();

  React.useEffect(() => {
    setInitialContent();
  }, [])

  React.useEffect(() => {
    if (!displayMD) {
      const htmlToDisplay = createHTML(md);
      setHTML(htmlToDisplay)
    }
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

  const ulListStyleTransform = () => {
    const {
      textBeforeSelection,
      selectedText,
      textAfterSelection
    } = getSelectionState();

    const lines = selectedText.split("\n");
    if (lines.length === 1) {
      const selectedTextWithListStyle = textBeforeSelection + "* ";
      const stateWithNewULList = selectedTextWithListStyle + textAfterSelection;
      saveMDAndHTMLState(stateWithNewULList);
      setTextAreaFocus(selectedTextWithListStyle.length);
    } else {
      const linesTransformed = lines.reduce((acc, currentLine, idx) => {
        if (idx === 1) {
          const lineToAdd = acc !== "" ? `\n* ${acc}` : acc + `\n* ${currentLine} \n`;
          return lineToAdd
        } else {
          const lineToAdd = currentLine !== "" ? `\n*${currentLine} \n` : ""
          return acc + lineToAdd;
        }
      })
      const selectedTextWithListStyle = textBeforeSelection + linesTransformed;
      const stateWithNewOLList = selectedTextWithListStyle + textAfterSelection;
      saveMDAndHTMLState(stateWithNewOLList);
      setTextAreaFocus(selectedTextWithListStyle.length);
    }

  }

  const olListStyleTransform = () => {
    const {
      textBeforeSelection,
      selectedText,
      textAfterSelection
    } = getSelectionState();

    const lines = selectedText.split("\n");

    if (lines.length === 1) {
      const selectedTextWithListStyle = textBeforeSelection + `1. ${lines[0]}`;
      const stateWithNewOLList = selectedTextWithListStyle + textAfterSelection;
      saveMDAndHTMLState(stateWithNewOLList);
      setTextAreaFocus(selectedTextWithListStyle.length);
    } else {
      const linesTransformed = lines.reduce((acc, currentLine, idx) => {
        if (idx === 1) {
          const lineToAdd = acc !== "" ? `\n${idx}. ${acc}\n` : acc + `\n${idx}. ${currentLine} \n`;
          return lineToAdd
        } else {
          const lineToAdd = currentLine !== "" ? `\n${idx}. ${currentLine} \n` : ""
          return acc + lineToAdd;
        }
      })
      const selectedTextWithListStyle = textBeforeSelection + linesTransformed;
      const stateWithNewOLList = selectedTextWithListStyle + textAfterSelection;
      saveMDAndHTMLState(stateWithNewOLList);
      setTextAreaFocus(selectedTextWithListStyle.length);
    }
  }

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
        olListStyleTransform();
        break;
      }
      case 'UL': {
        ulListStyleTransform();
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
          buttonStyle={props.styles.btn}
          controlsContainer={props.styles.controlsContainer}
          onSelectControl={onSelectControl}
          onChangeLanguage={onChangeLanguage}
        />
      )}
      <div
        className={classes.mainContainer}
        style={{
          height: props.height,
          ...props.styles.mainContainer
        }}
      >
        {displayMD && (
          <div
            className={classes.markdownContainer}
            style={props.styles.markdownContainer}
          >
            <textarea
              className={classes.markdownEditor}
              id='devkeep-md-textarea'
              style={props.styles.markdownEditor}
              onChange={onChangeMarkdown}
              value={md}
              ref={textarea}
            />
          </div>
        )}
        {!displayMD && html && (
          <div className={classes.htmlContainer} style={props.styles.htmlContainer} dangerouslySetInnerHTML={{ __html: html }}></div>
        )}
      </div>
    </>
  );
};

export default MdEditor;
