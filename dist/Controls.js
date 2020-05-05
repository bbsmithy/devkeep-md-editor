import * as React from 'react';
import { ReactComponent as CodeIcon } from './code-solid.svg';
import { ReactComponent as BoldIcon } from './bold-solid.svg';
import { ReactComponent as ItalicIcon } from './italic-solid.svg';
import { ReactComponent as OLIcon } from './list-ol-solid.svg';
import { ReactComponent as ULIcon } from './list-ul-solid.svg';
import { ReactComponent as BlockQuoteIcon } from './quote-right-solid.svg';
import './Controls.css'; // H1 H2 H3 H4
// H1 -> # (TEXT)
// H2 -> ## (TEXT)
// H3 -> ### (TEXT)
// H4 -> #### (TEXT)
// </> -> ```lang (CODE)  ```
// Blockqoute -> > (TEXT)
//               > (TEXT)
// OL -> 1. (TEXT)
//       2. (TEXT)
// UL -> * (TEXT)
//       * (TEXT)

var Controls = function Controls(props) {
  var onChangeLanguage = function onChangeLanguage(evt) {
    props.onChangeLanguage(evt.target.value);
  };

  return React.createElement("div", {
    style: props.controlsContainer,
    className: "controls-container"
  }, React.createElement("button", {
    value: "H1",
    style: props.buttonStyle,
    onClick: props.onSelectControl
  }, "H1"), React.createElement("button", {
    value: "H2",
    style: props.buttonStyle,
    onClick: props.onSelectControl
  }, "H2"), React.createElement("button", {
    value: "H3",
    style: props.buttonStyle,
    onClick: props.onSelectControl
  }, "H3"), React.createElement("button", {
    value: "H4",
    style: props.buttonStyle,
    onClick: props.onSelectControl
  }, "H4"), React.createElement("button", {
    value: "CODE",
    style: props.buttonStyle,
    onClick: props.onSelectControl
  }, React.createElement(CodeIcon, {
    height: 12,
    width: 12
  })), React.createElement("input", {
    placeholder: "Language",
    onChange: onChangeLanguage,
    style: props.langStyle
  }), React.createElement("button", {
    value: "BLOCKQUOTE",
    style: props.buttonStyle,
    onClick: props.onSelectControl
  }, React.createElement(BlockQuoteIcon, {
    height: 12,
    width: 12
  })), React.createElement("button", {
    value: "BOLD",
    style: props.buttonStyle,
    onClick: props.onSelectControl
  }, React.createElement(BoldIcon, {
    height: 12,
    width: 12
  })), React.createElement("button", {
    value: "ITALIC",
    style: props.buttonStyle,
    onClick: props.onSelectControl
  }, React.createElement(ItalicIcon, {
    height: 12,
    width: 12
  })), React.createElement("button", {
    value: "OL",
    style: props.buttonStyle,
    onClick: props.onSelectControl
  }, React.createElement(OLIcon, {
    height: 12,
    width: 12
  })), React.createElement("button", {
    value: "UL",
    style: props.buttonStyle,
    onClick: props.onSelectControl
  }, React.createElement(ULIcon, {
    height: 12,
    width: 12
  })));
};

export default Controls;