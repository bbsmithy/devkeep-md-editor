import * as React from 'react';
import { FaBold, FaCode, FaQuoteRight, FaListOl, FaListUl, FaItalic } from 'react-icons/fa';
import { createUseStyles } from 'react-jss';
var useStyles = createUseStyles(function () {
  return {
    btnControl: {
      cursor: 'pointer',
      display: 'inline-block',
      '&:focus': {
        outline: 'none'
      }
    },
    controlsContainer: {
      width: '100%'
    }
  };
});

var Controls = function Controls(props) {
  var classes = useStyles();
  return React.createElement("div", {
    style: props.controlsContainer,
    className: classes.controlsContainer
  }, React.createElement("button", {
    value: "H1",
    style: props.buttonStyle,
    className: classes.btnControl,
    onClick: props.onSelectControl
  }, "H1"), React.createElement("button", {
    value: "H2",
    style: props.buttonStyle,
    className: classes.btnControl,
    onClick: props.onSelectControl
  }, "H2"), React.createElement("button", {
    value: "H3",
    style: props.buttonStyle,
    className: classes.btnControl,
    onClick: props.onSelectControl
  }, "H3"), React.createElement("button", {
    value: "H4",
    style: props.buttonStyle,
    className: classes.btnControl,
    onClick: props.onSelectControl
  }, "H4"), React.createElement("button", {
    value: "CODE",
    style: props.buttonStyle,
    className: classes.btnControl,
    onClick: props.onSelectControl
  }, React.createElement(FaCode, null)), React.createElement("button", {
    value: "BLOCKQUOTE",
    style: props.buttonStyle,
    className: classes.btnControl,
    onClick: props.onSelectControl
  }, React.createElement(FaQuoteRight, null)), React.createElement("button", {
    value: "BOLD",
    style: props.buttonStyle,
    className: classes.btnControl,
    onClick: props.onSelectControl
  }, React.createElement(FaBold, null)), React.createElement("button", {
    value: "ITALIC",
    style: props.buttonStyle,
    className: classes.btnControl,
    onClick: props.onSelectControl
  }, React.createElement(FaItalic, null)), React.createElement("button", {
    value: "OL",
    style: props.buttonStyle,
    className: classes.btnControl,
    onClick: props.onSelectControl
  }, React.createElement(FaListOl, null)), React.createElement("button", {
    value: "UL",
    style: props.buttonStyle,
    className: classes.btnControl,
    onClick: props.onSelectControl
  }, React.createElement(FaListUl, null)));
};

export default Controls;