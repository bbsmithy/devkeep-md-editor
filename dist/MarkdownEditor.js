import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-dark.css';
import Controls from './Controls';
import './MarkdownEditor.css';

var showdown = require('showdown');

var sd = new showdown.Converter();
sd.addExtension(function () {
  return [{
    type: "output",
    filter: function filter(text, converter, options) {
      var left = "<pre><code\\b[^>]*>",
          right = "</code></pre>",
          flags = "g";

      var replacement = function replacement(wholeMatch, match, left, right) {
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
});
var codeBackTicks = '```';

var MdEditor = function MdEditor(props) {
  var _React$useState = React.useState(),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      html = _React$useState2[0],
      setHTML = _React$useState2[1];

  var _React$useState3 = React.useState(''),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      md = _React$useState4[0],
      setMD = _React$useState4[1];

  var _React$useState5 = React.useState(true),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      displayMD = _React$useState6[0],
      setDisplayMD = _React$useState6[1];

  var textarea = React.useRef(null);

  var _React$useState7 = React.useState(''),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      codeLang = _React$useState8[0],
      setCodeLang = _React$useState8[1];

  React.useEffect(function () {
    setInitialContent();
  }, []);
  React.useEffect(function () {
    setTextAreaFocus(md.length);
    document.addEventListener('keydown', commandListener);
    return function () {
      return document.removeEventListener('keydown', commandListener);
    };
  }, [displayMD]);

  var setInitialContent = function setInitialContent() {
    var _props$initialContent = props.initialContent,
        type = _props$initialContent.type,
        content = _props$initialContent.content;

    if (type === 'html') {
      setHTML(content);
      var newMarkdown = sd.makeMarkdown(content);
      setMD(newMarkdown);
    } else if (type === 'md') {
      setMD(content);
      var newHtml = sd.makeHtml(content);
      setHTML(newHtml);
    }
  };

  var setTextAreaFocus = function setTextAreaFocus(selectionEnd) {
    if (textarea.current) {
      textarea.current.focus();
      textarea.current.setSelectionRange(selectionEnd, selectionEnd);
    }
  };

  var commandListener = function commandListener(e) {
    var keyCode = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
    var cmdUsed = window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;
    var tabPressed = keyCode === 9 && !e.shiftKey && !e.ctrlKey && !e.altKey;
    var returnPressed = keyCode === 13;
    var cmdKey = keyCode === 83 || keyCode === 68 || keyCode === 75;

    if (cmdUsed && cmdKey) {
      e.preventDefault();
      cmdAction(keyCode);
    } else if (tabPressed || returnPressed) {
      e.preventDefault();
      formattingAction(keyCode);
    }
  }; // cmd/ctrl (save(CMD+S), delete(CMD+D), toogle md/html(CMD+K)) handler


  var cmdAction = function cmdAction(keyCode) {
    switch (keyCode) {
      case 83:
        {
          props.onSave(md, html);
          break;
        }

      case 68:
        {
          props.onDelete();
          break;
        }

      case 75:
        {
          setDisplayMD(!displayMD);
          break;
        }

      default:
        break;
    }
  }; // Tab or new line handler


  var formattingAction = function formattingAction(keyCode) {
    switch (keyCode) {
      case 9:
        {
          insertTab();
          break;
        }

      case 13:
        {
          insertNewLine();
          break;
        }

      default:
        break;
    }
  };

  var insertTab = function insertTab() {
    if (textarea.current.setSelectionRange) {
      var sS = textarea.current.selectionStart;
      var sE = textarea.current.selectionEnd;
      var insertAfterText = textarea.current.value.substring(0, sS);
      var insertAfterTextWithTab = insertAfterText + '   ';
      var stateWithTab = insertAfterTextWithTab + textarea.current.value.substr(sE);
      setMD(stateWithTab);
      setTextAreaFocus(insertAfterTextWithTab.length);
    }
  };

  var insertNewLine = function insertNewLine() {
    // This will check the previous line for indentation
    // and then add the same indentation to the new line
    var _getSelectionState = getSelectionState(),
        textBeforeSelection = _getSelectionState.textBeforeSelection,
        textAfterSelection = _getSelectionState.textAfterSelection;

    var currentLine = getCurrentLine();
    var indent = currentLine.match(/^\s*/)[0];
    var textBeforeWithIndent = textBeforeSelection + '\n' + indent;
    var stateWithNewLine = textBeforeWithIndent + textAfterSelection;
    saveMDAndHTMLState(stateWithNewLine);
    setTextAreaFocus(textBeforeWithIndent.length);
  };

  var saveMDAndHTMLState = function saveMDAndHTMLState(markdown) {
    var html = createHTML(markdown);
    setHTML(html);
    setMD(markdown);
  };

  var createHTML = function createHTML(markdown) {
    return sd.makeHtml(markdown);
  };

  var onChangeMarkdown = function onChangeMarkdown(evt) {
    saveMDAndHTMLState(evt.currentTarget.value);
  };

  var getCurrentLine = function getCurrentLine() {
    var sStart = textarea.current.selectionStart;
    return textarea.current.value.substr(0, sStart).split('\n').pop();
  };

  var getSelectionState = function getSelectionState() {
    var sStart = textarea.current.selectionStart;
    var sEnd = textarea.current.selectionEnd;
    var textBeforeSelection = textarea.current.value.substring(0, sStart);
    var selectedText = textarea.current.value.substring(sStart, sEnd);
    var textAfterSelection = textarea.current.value.substr(sEnd);
    return {
      textBeforeSelection: textBeforeSelection,
      selectedText: selectedText,
      textAfterSelection: textAfterSelection
    };
  };

  var replaceHeadingMD = function replaceHeadingMD(heading, headingMDCode) {
    var filteredHeading = heading.replace(/#/g, '').trim();
    var newHeading = "".concat(headingMDCode, " ").concat(filteredHeading);
    return newHeading;
  };

  var titleTransform = function titleTransform(mdMark) {
    var _getSelectionState2 = getSelectionState(),
        textBeforeSelection = _getSelectionState2.textBeforeSelection,
        selectedText = _getSelectionState2.selectedText,
        textAfterSelection = _getSelectionState2.textAfterSelection;

    var newHeading = replaceHeadingMD(selectedText, mdMark);
    var stateWithMDMark = textBeforeSelection + newHeading + textAfterSelection;
    saveMDAndHTMLState(stateWithMDMark);
  };

  var codeTransform = function codeTransform() {
    var _getSelectionState3 = getSelectionState(),
        textBeforeSelection = _getSelectionState3.textBeforeSelection,
        selectedText = _getSelectionState3.selectedText,
        textAfterSelection = _getSelectionState3.textAfterSelection;

    var selectedTextAsCodeBlock = "".concat(codeBackTicks).concat(codeLang) + '\n' + selectedText + '\n' + "".concat(codeBackTicks);
    console.log(selectedText);
    var stateWithCodeBlock = textBeforeSelection + selectedTextAsCodeBlock + textAfterSelection;
    saveMDAndHTMLState(stateWithCodeBlock);
  };

  var blockqouteTransform = function blockqouteTransform() {
    var _getSelectionState4 = getSelectionState(),
        textBeforeSelection = _getSelectionState4.textBeforeSelection,
        selectedText = _getSelectionState4.selectedText,
        textAfterSelection = _getSelectionState4.textAfterSelection;

    var selectedTextWithQuoteBlock = '';
    selectedText.split('\n').forEach(function (line) {
      selectedTextWithQuoteBlock += ">".concat(line, " \n");
    });
    var stateWithQuoteBlock = textBeforeSelection + selectedTextWithQuoteBlock + textAfterSelection;
    saveMDAndHTMLState(stateWithQuoteBlock);
  };

  var textStyleTransform = function textStyleTransform(style) {
    var _getSelectionState5 = getSelectionState(),
        textBeforeSelection = _getSelectionState5.textBeforeSelection,
        selectedText = _getSelectionState5.selectedText,
        textAfterSelection = _getSelectionState5.textAfterSelection;

    var selectedTextWithStyle = "".concat(style).concat(selectedText).concat(style);
    var stateWithStyledBlock = textBeforeSelection + selectedTextWithStyle + textAfterSelection;
    saveMDAndHTMLState(stateWithStyledBlock);
  };

  var onSelectControl = function onSelectControl(evt) {
    var control = evt.currentTarget.value;

    switch (control) {
      case 'H1':
        {
          titleTransform('#');
          break;
        }

      case 'H2':
        {
          titleTransform('##');
          break;
        }

      case 'H3':
        {
          titleTransform('###');
          break;
        }

      case 'H4':
        {
          titleTransform('####');
          break;
        }

      case 'CODE':
        {
          codeTransform();
          break;
        }

      case 'BLOCKQUOTE':
        {
          blockqouteTransform();
          break;
        }

      case 'BOLD':
        {
          textStyleTransform('**');
          break;
        }

      case 'ITALIC':
        {
          textStyleTransform('*');
          break;
        }

      case 'OL':
        {
          console.log('handle ol'); // transform(control);

          break;
        }

      case 'UL':
        {
          console.log('handle ul'); // transform(control);

          break;
        }

      default:
        {
          console.log('NO CONTROL');
        }
    }
  };

  var onChangeLanguage = function onChangeLanguage(lang) {
    setCodeLang(lang);
  };

  return React.createElement(React.Fragment, null, displayMD && React.createElement(Controls, {
    onSelectControl: onSelectControl,
    onChangeLanguage: onChangeLanguage
  }), React.createElement("div", {
    className: "mainContainer",
    style: _objectSpread({
      height: props.height
    }, props.styles.mainContainer)
  }, displayMD && React.createElement("div", {
    className: "markdownContainer",
    style: props.styles.markdownContainer
  }, React.createElement("textarea", {
    className: "markdownEditor",
    id: "devkeep-md-textarea",
    style: props.styles.markdownEditor,
    onChange: onChangeMarkdown,
    value: md,
    ref: textarea
  })), !displayMD && html && React.createElement("div", {
    className: "htmlContainer",
    style: props.styles.htmlContainer,
    dangerouslySetInnerHTML: {
      __html: html
    }
  })));
};

export default MdEditor;