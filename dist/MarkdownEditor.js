import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import React, { createElement, useRef } from "react";
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
      useSpellChecker = props.useSpellChecker,
      toolbarOptions = props.toolbarOptions,
      theme = props.theme,
      defaultView = props.defaultView,
      simplemdeHandle = props.simplemdeHandle,
      codeMirrorHandle = props.codeMirrorHandle;
  var simplemdeRef = useRef();
  useEffect(function () {
    setUpSimpleMDE(initialValue);
    document.addEventListener('keydown', commandListener);
    return function () {
      return document.removeEventListener('keydown', commandListener);
    };
  }, []);
  useEffect(function () {
    applyStyleOptions();
  }, [theme]);

  var setUpSimpleMDE = function setUpSimpleMDE(initialValue) {
    var toolbar = toolbarOptions ? [].concat(_toConsumableArray(toolbarOptions), [{
      name: "save",
      action: function action() {
        return onSave(simplemdeRef.current.value());
      },
      className: "fa fa-save",
      title: "Save"
    }, {
      name: "delete",
      action: onDelete,
      className: "fa fa-trash",
      title: "Delete"
    }]) : ["bold", "italic", "heading", "|", "quote", "ordered-list", "unordered-list", "|", "code", "link", "image", "table", "|", "preview", "side-by-side", "fullscreen", "|", {
      name: "delete",
      action: onDelete,
      className: "fa fa-trash",
      title: "Delete"
    }, {
      name: "save",
      action: function action() {
        return onSave(simplemdeRef.current.value());
      },
      className: "fa fa-save",
      title: "Save"
    }];
    simplemdeRef.current = new SimpleMDE({
      element: document.getElementById("editor"),
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true
      },
      toolbar: toolbar,
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
      styleSelectedText: true,
      status: false
    });
    if (defaultView) setupDefaultView(defaultView);
    if (props.title) setupTitle(props.title);
    if (codeMirrorHandle) codeMirrorHandle(simplemdeRef.current.codemirror);
    if (simplemdeHandle) simplemdeHandle(simplemdeRef.current);
  };

  var setupTitle = function setupTitle(title) {
    var titleContainer = document.createElement('div');
    var titleElement = document.createElement('h4');
    titleElement.innerText = props.title;
    titleElement.style.margin = "8px 0px 8px 5px";
    titleElement.style.display = "inline-block";
    titleContainer.appendChild(titleElement);

    if (props.onBack) {
      var backBtnElement = document.createElement('div');
      backBtnElement.innerHTML = '<i class="fa fa-arrow-left"></i>';
      backBtnElement.style.display = "inline-block";
      backBtnElement.style.cursor = "pointer";
      backBtnElement.style.backgroundColor = props.theme.toolbar.background;
      backBtnElement.style.borderRadius = "5px";
      backBtnElement.style.padding = "5px";
      backBtnElement.style.color = props.theme.toolbar.color;
      backBtnElement.style.cursor = "pointer";
      backBtnElement.addEventListener("click", props.onBack);
      titleContainer.prepend(backBtnElement);
    }

    document.getElementsByClassName("editor-toolbar")[0].prepend(titleContainer);
  };

  var setupDefaultView = function setupDefaultView(viewType) {
    switch (viewType) {
      case 'fullscreen':
        {
          if (simplemdeRef.current.toolbarElements["fullscreen"]) {
            simplemdeRef.current.toggleFullScreen();
          }

          break;
        }

      case 'preview':
        {
          if (simplemdeRef.current.toolbarElements["preview"]) {
            simplemdeRef.current.togglePreview();
          }

          break;
        }

      case 'side-by-side':
        {
          if (simplemdeRef.current.toolbarElements["side-by-side"]) {
            simplemdeRef.current.toggleSideBySide();
          }

          break;
        }
    }
  };

  var applyStyleOptions = function applyStyleOptions() {
    var header = document.getElementsByTagName('head')[0];
    var devkeepEditorThemeStyle = document.getElementById('devkeep-md-editor-theme');

    if (devkeepEditorThemeStyle) {
      var customStyleString = createThemeStyleSheet();
      devkeepEditorThemeStyle.innerHTML = customStyleString;
    } else {
      var customThemeStyle = document.createElement('style');
      customThemeStyle.id = "devkeep-md-editor-theme";

      var _customStyleString = createThemeStyleSheet();

      customThemeStyle.innerHTML = _customStyleString;
      header.appendChild(customThemeStyle);
    }

    if (props.useHighlightJS) {
      var highlightTheme = document.getElementById('devkeep-highlight-theme');

      var _fetchHighlightJS = fetchHighlightJS(),
          highlightScript = _fetchHighlightJS.highlightScript,
          highlightThemeStyle = _fetchHighlightJS.highlightThemeStyle;

      if (highlightTheme) {
        // Replace existing highlight theme
        header.replaceChild(highlightThemeStyle, highlightTheme);
      } else {
        // Add highlight theme
        header.appendChild(highlightThemeStyle);
      }

      if (!document.getElementById('devkeep-highlight-script')) {
        header.appendChild(highlightScript);
      }
    }
  };

  var createThemeStyleSheet = function createThemeStyleSheet() {
    var _props$theme = props.theme,
        editor = _props$theme.editor,
        preview = _props$theme.preview,
        toolbar = _props$theme.toolbar,
        cursorColor = _props$theme.cursorColor,
        height = _props$theme.height;
    var customStyleString = '';
    if (preview) customStyleString = createPreviewStyles(preview);
    if (toolbar) customStyleString = customStyleString + createToolbarStyles(toolbar);

    if (editor) {
      var editorStyle = "#editor-container .CodeMirror {\n        background-color: ".concat(editor.background || "white", " !important;\n        color: ").concat(editor.color || "black", " !important;\n        height: ").concat(height || "100%", ";\n      }\n      #editor-container .CodeMirror .fullscreen {\n        height: 100% !important\n      }\n      ");
      customStyleString = customStyleString + editorStyle;
    }

    if (cursorColor) {
      customStyleString = customStyleString + "\n        .CodeMirror-cursor {\n            border-left: 1px solid ".concat(cursorColor, " !important;\n          }\n        ");
    }

    return customStyleString;
  };

  var createPreviewStyles = function createPreviewStyles(_ref) {
    var _ref$codeBlockBackgro = _ref.codeBlockBackground,
        codeBlockBackground = _ref$codeBlockBackgro === void 0 ? "black" : _ref$codeBlockBackgro,
        _ref$background = _ref.background,
        background = _ref$background === void 0 ? "white" : _ref$background,
        _ref$color = _ref.color,
        color = _ref$color === void 0 ? "black" : _ref$color,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? "100%" : _ref$height;
    return "\n    #editor-container .editor-preview-side pre {\n      background: ".concat(codeBlockBackground, ";\n      padding: 5px\n    }\n    #editor-container .editor-preview-side {\n      background-color: ").concat(background, " !important;\n      color: ").concat(color, " !important;\n    }\n    #editor-container .editor-preview-side.fullscreen {\n      background-color: ").concat(background, " !important;\n      color: ").concat(color, " !important;\n    }\n    #editor-container .editor-preview {\n      background-color: ").concat(background, " !important;\n      color: ").concat(color, " !important;\n      height: ").concat(height, " !important;\n    }\n    #editor-container .editor-preview pre {\n      background: ").concat(codeBlockBackground, ";\n      padding: 5px\n    }\n    #editor-container .editor-preview.fullscreen {\n      background-color: ").concat(background, " !important;\n      color: ").concat(color, " !important;\n    }\n    #editor-container .editor-preview h1,\n    #editor-container .editor-preview h2 {\n      border-bottom: 1px solid ").concat(color, ";\n    }\n    #editor-container .editor-preview-side h1,\n    #editor-container .editor-preview-side h2 {\n      border-bottom: 1px solid ").concat(color, ";\n    }\n    #editor-container .editor-preview .fullscreen h1,\n    #editor-container .editor-preview .fullscreen h2 {\n      border-bottom: 1px solid ").concat(color, ";\n    }\n    ");
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
        disabledBtnBackground = _ref2$disabledBtnBack === void 0 ? "white" : _ref2$disabledBtnBack,
        _ref2$height = _ref2.height,
        height = _ref2$height === void 0 ? "82px" : _ref2$height;
    return "\n    #editor-container .editor-toolbar {\n      background-color: ".concat(background, " !important;\n      color: ").concat(color, " !important;\n      height: ").concat(height, "\n    }\n    #editor-container .editor-toolbar.fullscreen {\n      background-color: ").concat(background, " !important;\n      color: ").concat(color, " !important;\n      height: ").concat(height, "\n    }\n    #editor-container .editor-toolbar a {\n      color: ").concat(color, " !important;\n    }\n    #editor-container .editor-toolbar a.active {\n      color: ").concat(activeBtnColor, " !important;\n      background: ").concat(activeBtnBackground, " !important;\n    }\n    #editor-container .editor-toolbar .fullscreen a {\n      color: ").concat(color, " !important;\n    }\n    #editor-container .editor-toolbar .fullscreen a.active, a:hover {\n      color: ").concat(activeBtnColor, " !important;\n      background: ").concat(activeBtnBackground, " !important;\n    }\n    #editor-container .editor-toolbar.disabled-for-preview a:not(.no-disable) {\n      color: ").concat(disabledBtnColor, " !important;\n      background: ").concat(disabledBtnBackground, " !important;\n    }\n    ");
  };

  var fetchHighlightJS = function fetchHighlightJS() {
    var highlightScript = document.createElement("script");
    var highlightThemeStyle = document.createElement("link");
    highlightThemeStyle.rel = "stylesheet";
    highlightThemeStyle.id = "devkeep-highlight-theme";
    highlightScript.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/highlight.min.js";
    highlightScript.id = "devkeep-highlight-script";

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
            onSave(simplemdeRef.current.value());
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