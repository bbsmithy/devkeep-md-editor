import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import './MarkdownEditor.css';
import Controls from './Controls';

var MarkdownIt = require('markdown-it');

var mdIt = new MarkdownIt({
  html: true // Enable HTML tags in source

});
var titleControls = ['H1', 'H2', 'H3', 'H4'];

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
  React.useEffect(function () {
    setTextAreaFocus(md.length);
    document.addEventListener('keydown', commandListener);
    return function () {
      return document.removeEventListener('keydown', commandListener);
    };
  }, [displayMD]);

  var setTextAreaFocus = function setTextAreaFocus(selectionEnd) {
    if (textarea.current) {
      textarea.current.focus();
      textarea.current.setSelectionRange(selectionEnd, selectionEnd);
    }
  };

  var commandListener = function commandListener(e) {
    var keyCode = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
    var cmdUsed = window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;
    var tabPressed = keyCode == 9 && !e.shiftKey && !e.ctrlKey && !e.altKey;

    if ((cmdUsed || tabPressed) && (keyCode === 83 || keyCode === 68 || keyCode === 75 || keyCode === 9)) {
      e.preventDefault();

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

        case 9:
          {
            insertTab();
            break;
          }
      }
    }
  };

  var insertTab = function insertTab() {
    if (textarea.current.setSelectionRange) {
      var sS = textarea.current.selectionStart;
      var sE = textarea.current.selectionEnd;
      var insertAfterText = textarea.current.value.substring(0, sS);
      var insertAfterTextWithTab = insertAfterText + '\t';
      var stateWithTab = insertAfterTextWithTab + textarea.current.value.substr(sE);
      setMD(stateWithTab);
      setTextAreaFocus(insertAfterTextWithTab.length);
    }
  };

  var saveMDAndHTMLState = function saveMDAndHTMLState(markdown) {
    var html = createHTML(markdown);
    setHTML(html);
    setMD(markdown);
  };

  var createHTML = function createHTML(markdown) {
    return mdIt.render(markdown);
  };

  var onChangeMarkdown = function onChangeMarkdown(evt) {
    saveMDAndHTMLState(evt.currentTarget.value);
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

  var titleTransform = function titleTransform(control, mdMark) {
    var _getSelectionState = getSelectionState(),
        textBeforeSelection = _getSelectionState.textBeforeSelection,
        selectedText = _getSelectionState.selectedText,
        textAfterSelection = _getSelectionState.textAfterSelection;

    var newHeading = replaceHeadingMD(selectedText, mdMark);
    var stateWithMDMark = textBeforeSelection + newHeading + textAfterSelection;
    saveMDAndHTMLState(stateWithMDMark);
  };

  var codeTransform = function codeTransform() {
    var state = getSelectionState();
    console.log(state);
  };

  var onSelectControl = function onSelectControl(evt) {
    var control = evt.currentTarget.value;

    switch (control) {
      case 'H1':
        {
          console.log('handle h1');
          titleTransform(control, '#');
          break;
        }

      case 'H2':
        {
          console.log('handle h2');
          titleTransform(control, '##');
          break;
        }

      case 'H3':
        {
          console.log('handle h3');
          titleTransform(control, '###');
          break;
        }

      case 'H4':
        {
          console.log('handle h4');
          titleTransform(control, '####');
          break;
        }

      case 'CODE':
        {
          console.log('handle code');
          codeTransform();
          break;
        }

      case 'BLOCKQUOTE':
        {
          console.log('handle blockqoute'); // transform(control);

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
          console.log('NO CONTROL'); // transform(control);
        }
    }
  };

  return React.createElement(React.Fragment, null, displayMD && React.createElement(Controls, {
    onSelectControl: onSelectControl
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
  })), !displayMD && React.createElement("div", {
    className: "htmlContainer",
    style: props.styles.htmlContainer
  }, html && React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: html
    }
  }))));
};

export default MdEditor;