import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import * as React from 'react';
import './MarkdownEditor.css';

var MarkdownIt = require('markdown-it');

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

    _this.commandListener = function (e) {
      if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && (e.keyCode === 83 || e.keyCode === 68 || e.keyCode === 86)) {
        e.preventDefault();

        switch (e.keyCode) {
          case 83:
            {
              console.log('SAVE');
              break;
            }

          case 68:
            {
              console.log('DELETE');
              break;
            }

          case 86:
            {
              _this.setState({
                displayMD: !_this.state.displayMD
              });

              break;
            }
        }
      }
    };

    _this.createHTML = function (markdown) {
      return md.render(markdown);
    };

    _this.onChangeMarkdown = function (evt) {
      var html = _this.createHTML(evt.currentTarget.value);

      _this.setState({
        html: html,
        md: evt.currentTarget.value
      });
    };

    _this.state = {
      html: '',
      md: '',
      displayMD: true
    };
    return _this;
  }

  _createClass(MdEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener('keydown', this.commandListener);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "mainContainer",
        style: _objectSpread({
          height: this.props.height
        }, this.props.styles.mainContainer)
      }, this.state.displayMD && React.createElement("div", {
        className: "markdownContainer",
        style: this.props.styles.markdownContainer
      }, React.createElement("textarea", {
        className: "markdownEditor",
        style: this.props.styles.markdownEditor,
        onChange: this.onChangeMarkdown
      }, this.state.md)), !this.state.displayMD && React.createElement("div", {
        className: "htmlContainer",
        style: this.props.styles.htmlContainer
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