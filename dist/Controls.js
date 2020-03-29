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
  }, "Code"), React.createElement("button", {
    value: "BLOCKQUOTE",
    onClick: props.onSelectControl
  }, "Blockqoute"), React.createElement("button", {
    value: "OL",
    onClick: props.onSelectControl
  }, "OL"), React.createElement("button", {
    value: "UL",
    onClick: props.onSelectControl
  }, "UL"));
};

export default Controls;