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

  var _React$useState3 = React.useState(),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      md = _React$useState4[0],
      setMD = _React$useState4[1];

  var _React$useState5 = React.useState(true),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      displayMD = _React$useState6[0],
      setDisplayMD = _React$useState6[1];

  React.useEffect(function () {
    document.addEventListener('keydown', commandListener);
    return function () {
      return document.removeEventListener('keydown', commandListener);
    };
  }, [displayMD]);

  var commandListener = function commandListener(e) {
    if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && (e.keyCode === 83 || e.keyCode === 68 || e.keyCode === 75)) {
      e.preventDefault();

      switch (e.keyCode) {
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
      }
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

  var onTab = function onTab(e) {
    var textarea = e.currentTarget;
    var keyCode = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;

    if (keyCode == 9 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();

      if (textarea.setSelectionRange) {
        var sS = textarea.selectionStart;
        var sE = textarea.selectionEnd;
        var insertAfterText = textarea.value.substring(0, sS);
        var stateWithTab = insertAfterText + '\t' + textarea.value.substr(sE);
        setMD(stateWithTab);
      } else if (textarea.createTextRange) {
        document.selection.createRange().text = '\t';
        e.returnValue = false;
      }

      return false;
    }

    return true;
  };

  var replaceHeadingMD = function replaceHeadingMD(heading, headingMDCode) {
    var filteredHeading = heading.replace(/#/g, '').trim();
    var newHeading = "".concat(headingMDCode, " ").concat(filteredHeading);
    return newHeading;
  };

  var transform = function transform(control, mdMark) {
    var textarea = document.getElementById('devkeep-md-textarea');
    var sStart = textarea.selectionStart;
    var sEnd = textarea.selectionEnd;
    var remainingTextBeforeSelection = textarea.value.substring(0, sStart);
    var selectedText = textarea.value.substring(sStart, sEnd);
    var remainingTextAfterSelection = textarea.value.substr(sEnd);

    if (titleControls.includes(control)) {
      var newHeading = replaceHeadingMD(selectedText, mdMark);
      var stateWithMDMark = remainingTextBeforeSelection + newHeading + remainingTextAfterSelection;
      saveMDAndHTMLState(stateWithMDMark);
      console.log(sEnd, sStart, stateWithMDMark);
    }
  };

  var onSelectControl = function onSelectControl(evt) {
    var control = evt.currentTarget.value;

    switch (control) {
      case 'H1':
        {
          console.log('handle h1');
          transform(control, '#');
          break;
        }

      case 'H2':
        {
          console.log('handle h2');
          transform(control, '##');
          break;
        }

      case 'H3':
        {
          console.log('handle h3');
          transform(control, '###');
          break;
        }

      case 'H4':
        {
          console.log('handle h4');
          transform(control, '####');
          break;
        }

      case 'CODE':
        {
          console.log('handle code');
          transform(control);
          break;
        }

      case 'BLOCKQUOTE':
        {
          console.log('handle blockqoute');
          transform(control);
          break;
        }

      case 'OL':
        {
          console.log('handle ol');
          transform(control);
          break;
        }

      case 'UL':
        {
          console.log('handle ul');
          transform(control);
          break;
        }

      default:
        {
          console.log('NO CONTROL');
          transform(control);
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
    onKeyDown: function onKeyDown(event) {
      return onTab(event);
    },
    style: props.styles.markdownEditor,
    onChange: onChangeMarkdown,
    value: md
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