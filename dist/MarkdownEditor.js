import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import * as React from "react";
import "./MarkdownEditor.css";

var MarkdownIt = require("markdown-it");

var md = new MarkdownIt({
  html: true // Enable HTML tags in source

});

var MdEditor =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MdEditor, _React$Component);

  function MdEditor(props) {
    var _this;

    _classCallCheck(this, MdEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MdEditor).call(this, props));

    _this.createHTML = function (markdown) {
      return md.render(markdown);
    };

    _this.onChangeMarkdown = function (evt) {
      var html = _this.createHTML(evt.currentTarget.value);

      _this.setState({
        html: html
      });
    };

    _this.onScrollMDContainer = function (evt) {
      _this.htmlContainerRef.current.scrollTop = _this.mdContainerRef.current.scrollTop;
    };

    _this.onScrollHTMLContainer = function (evt) {
      _this.mdContainerRef.current.scrollTop = _this.htmlContainerRef.current.scrollTop;
    };

    _this.mdContainerRef = React.createRef();
    _this.htmlContainerRef = React.createRef();
    _this.state = {
      html: ""
    };
    return _this;
  }

  _createClass(MdEditor, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "mainContainer",
        style: _objectSpread({
          height: this.props.height
        }, this.props.styles.mainContainer)
      }, React.createElement("div", {
        className: "markdownContainer",
        style: this.props.styles.markdownContainer
      }, React.createElement("textarea", {
        className: "markdownEditor",
        style: this.props.styles.markdownEditor,
        onScroll: this.onScrollMDContainer,
        ref: this.mdContainerRef,
        onChange: this.onChangeMarkdown
      })), React.createElement("div", {
        className: "htmlContainer",
        style: this.props.styles.htmlContainer,
        onScroll: this.onScrollHTMLContainer,
        ref: this.htmlContainerRef
      }, this.state.html && React.createElement("div", {
        dangerouslySetInnerHTML: {
          __html: this.state.html
        }
      })));
    }
  }]);

  return MdEditor;
}(React.Component);

export { MdEditor as default };