import React from "react";
import { useEffect } from "react";
import SimpleMDE from "simplemde";
import "./mde.css";
import "./custom.css";
var keyCommands = [83, 69, 79];

var MarkdownEditor = function MarkdownEditor(props) {
  var onSave = props.onSave,
      onDelete = props.onDelete,
      initialValue = props.initialValue,
      localSaveId = props.localSaveId,
      useSpellChecker = props.useSpellChecker;
  var simplemde;
  useEffect(function () {
    setUpSimpleMDE(initialValue);
    document.addEventListener('keydown', commandListener);
    return function () {
      return document.removeEventListener('keydown', commandListener);
    };
  }, [initialValue]);

  var setUpSimpleMDE = function setUpSimpleMDE(initialValue) {
    simplemde = new SimpleMDE({
      element: document.getElementById("editor"),
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true
      },
      toolbar: ["bold", "italic", "heading", "|", "quote", "ordered-list", "unordered-list", "|", "code", "link", "image", "|", "preview", "side-by-side", "fullscreen", "|", {
        name: "delete",
        action: onDelete,
        className: "fa fa-trash",
        title: "Delete"
      }, {
        name: "save",
        action: onSave,
        className: "fa fa-save",
        title: "Save"
      }],
      spellChecker: useSpellChecker,
      initialValue: initialValue,
      autofocus: true,
      shortcuts: {
        drawTable: "Cmd-Alt-T"
      },
      insertTexts: {
        horizontalRule: ["", "\n\n-----\n\n"],
        image: ["![](http://", ")"],
        link: ["[", "](http://)"],
        table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n"]
      },
      autosave: {
        enabled: true,
        uniqueId: localSaveId,
        delay: 1000
      },
      styleSelectedText: true
    });
    applyStyleOptions();
    props.codeMirrorHandle(simplemde.codemirror);
  };

  var applyStyleOptions = function applyStyleOptions() {
    var _props$theme = props.theme,
        editor = _props$theme.editor,
        preview = _props$theme.preview,
        toolbar = _props$theme.toolbar,
        cursorColor = _props$theme.cursorColor;
    var header = document.getElementsByTagName('head')[0];
    var customThemeStyle = document.createElement('style');
    var customStyleString = '';
    if (preview) customStyleString = createPreviewStyles(preview);
    if (toolbar) customStyleString = customStyleString + createToolbarStyles(toolbar);

    if (editor) {
      var editorStyle = ".CodeMirror {\n        background-color: ".concat(editor.background || "white", " !important;\n        color: ").concat(editor.color || "black", " !important;\n      }");
      customStyleString = customStyleString + editorStyle;
    }

    customThemeStyle.innerHTML = customStyleString + "\n      .CodeMirror-cursor {\n        border-left: 1px solid ".concat(cursorColor || "black", " !important;\n      }\n    ");
    header.appendChild(customThemeStyle);

    if (props.useHighlightJS) {
      var _fetchHighlightJS = fetchHighlightJS(),
          highlightScript = _fetchHighlightJS.highlightScript,
          highlightThemeStyle = _fetchHighlightJS.highlightThemeStyle;

      header.appendChild(highlightThemeStyle);
      header.appendChild(highlightScript);
    }
  };

  var createPreviewStyles = function createPreviewStyles(_ref) {
    var _ref$codeBlockBackgro = _ref.codeBlockBackground,
        codeBlockBackground = _ref$codeBlockBackgro === void 0 ? "black" : _ref$codeBlockBackgro,
        _ref$background = _ref.background,
        background = _ref$background === void 0 ? "white" : _ref$background,
        _ref$color = _ref.color,
        color = _ref$color === void 0 ? "black" : _ref$color;
    return "\n    .editor-preview-side pre {\n      background: ".concat(codeBlockBackground, ";\n      padding: 5px\n    }\n    .editor-preview-side {\n      background-color: ").concat(background, " !important;\n      color: ").concat(color, " !important;\n    }\n    .editor-preview-side.fullscreen {\n      background-color: ").concat(background, " !important;\n      color: ").concat(color, " !important;\n    }\n    .editor-preview {\n      background-color: ").concat(background, " !important;\n      color: ").concat(color, " !important;\n    }\n    .editor-preview pre {\n      background: ").concat(codeBlockBackground, ";\n      padding: 5px\n    }\n    .editor-preview.fullscreen {\n      background-color: ").concat(background, " !important;\n      color: ").concat(color, " !important;\n    }\n    .editor-preview h1, h2 {\n      border-bottom: 1px solid ").concat(color, ";\n    }\n    .editor-preview.fullscreen h1, h2 {\n      border-bottom: 1px solid ").concat(color, ";\n    }\n    ");
  };

  var createToolbarStyles = function createToolbarStyles(_ref2) {
    var _ref2$background = _ref2.background,
        background = _ref2$background === void 0 ? "white" : _ref2$background,
        _ref2$color = _ref2.color,
        color = _ref2$color === void 0 ? "black" : _ref2$color,
        _ref2$activeBtnColor = _ref2.activeBtnColor,
        activeBtnColor = _ref2$activeBtnColor === void 0 ? "black" : _ref2$activeBtnColor,
        _ref2$activeBtnBackgr = _ref2.activeBtnBackground,
        activeBtnBackground = _ref2$activeBtnBackgr === void 0 ? "white" : _ref2$activeBtnBackgr,
        _ref2$disabledBtnColo = _ref2.disabledBtnColor,
        disabledBtnColor = _ref2$disabledBtnColo === void 0 ? "gray" : _ref2$disabledBtnColo,
        _ref2$disabledBtnBack = _ref2.disabledBtnBackground,
        disabledBtnBackground = _ref2$disabledBtnBack === void 0 ? "white" : _ref2$disabledBtnBack;
    return "\n    .editor-toolbar {\n      background-color: ".concat(background, " !important;\n      color: ").concat(color, " !important;\n    }\n    .editor-toolbar.fullscreen {\n      background-color: ").concat(background, " !important;\n      color: ").concat(color, " !important;\n    }\n    .editor-toolbar a {\n      color: ").concat(color, " !important;\n    }\n    .editor-toolbar a.active {\n      color: ").concat(activeBtnColor, " !important;\n      background: ").concat(activeBtnBackground, " !important;\n    }\n    .editor-toolbar.fullscreen a {\n      color: ").concat(color, " !important;\n    }\n    .editor-toolbar.fullscreen a.active, a:hover {\n      color: ").concat(activeBtnColor, " !important;\n      background: ").concat(activeBtnBackground, " !important;\n    }\n    .editor-toolbar.disabled-for-preview a:not(.no-disable) {\n      color: ").concat(disabledBtnColor, " !important;\n      background: ").concat(disabledBtnBackground, " !important;\n    }\n    ");
  };

  var fetchHighlightJS = function fetchHighlightJS() {
    var highlightScript = document.createElement("script");
    var highlightThemeStyle = document.createElement("link");
    highlightThemeStyle.rel = "stylesheet";
    highlightScript.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/highlight.min.js";

    if (props.highlightTheme) {
      highlightThemeStyle.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/".concat(props.highlightTheme, ".min.css");
    } else {
      highlightThemeStyle.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/agate.min.css";
    }

    return {
      highlightScript: highlightScript,
      highlightThemeStyle: highlightThemeStyle
    };
  };

  var commandListener = function commandListener(e) {
    var keyCode = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
    var cmdUsed = window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;
    var cmdKeyPressed = keyCommands.includes(keyCode);

    if (cmdUsed && cmdKeyPressed) {
      e.preventDefault();
      cmdAction(keyCode);
    }
  }; // cmd/ctrl (save(CMD+S), delete(CMD+D)) handler


  var cmdAction = function cmdAction(keyCode) {
    switch (keyCode) {
      case 83:
        {
          if (onSave) {
            onSave(simplemde.value());
          }

          break;
        }

      case 68:
        {
          if (onDelete) {
            onDelete();
          }

          break;
        }

      default:
        break;
    }
  };

  return React.createElement("div", {
    id: "editor-container"
  }, React.createElement("textarea", {
    id: "editor"
  }));
};

export default MarkdownEditor;