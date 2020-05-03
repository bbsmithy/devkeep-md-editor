import * as React from 'react';
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
    className: "controls-container"
  }, React.createElement("button", {
    value: "H1",
    onClick: props.onSelectControl
  }, "H1"), React.createElement("button", {
    value: "H2",
    onClick: props.onSelectControl
  }, "H2"), React.createElement("button", {
    value: "H3",
    onClick: props.onSelectControl
  }, "H3"), React.createElement("button", {
    value: "H4",
    onClick: props.onSelectControl
  }, "H4"), React.createElement("button", {
    value: "CODE",
    onClick: props.onSelectControl
  }, "Code"), React.createElement("input", {
    placeholder: "lang",
    onChange: onChangeLanguage,
    style: {
      width: 50
    }
  }), React.createElement("button", {
    value: "BLOCKQUOTE",
    onClick: props.onSelectControl
  }, "Blockqoute"), React.createElement("button", {
    value: "BOLD",
    onClick: props.onSelectControl
  }, "Bold"), React.createElement("button", {
    value: "ITALIC",
    onClick: props.onSelectControl
  }, "Italic"), React.createElement("button", {
    value: "OL",
    onClick: props.onSelectControl
  }, "OL"), React.createElement("button", {
    value: "UL",
    onClick: props.onSelectControl
  }, "UL"));
};

export default Controls;