import React, { createElement, useRef } from "react"
import { useEffect } from "react"
import PropTypes from 'prop-types';
import SimpleMDE from "simplemde"
import "./mde.css";
import "./custom.css";

const keyCommands = [83, 69, 79];

const MarkdownEditor = (props) => {

  const {
    onSave,
    onDelete,
    initialValue,
    localSaveId,
    useSpellChecker,
    toolbarOptions,
    theme,
    defaultView,
    simplemdeHandle,
    codeMirrorHandle
  } = props;

  const simplemdeRef = useRef();

  useEffect(() => {
    setUpSimpleMDE(initialValue);
    document.addEventListener('keydown', commandListener);
    return () => document.removeEventListener('keydown', commandListener);
  }, [])

  useEffect(() => {
    applyStyleOptions();
  }, [theme])

  const setUpSimpleMDE = (initialValue) => {
    const toolbar = toolbarOptions ? [...toolbarOptions, {
      name: "save",
      action: () => onSave(simplemdeRef.current.value()),
      className: "fa fa-save",
      title: "Save",
    }, {
      name: "delete",
      action: onDelete,
      className: "fa fa-trash",
      title: "Delete",
    }] : [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "ordered-list",
        "unordered-list",
        "|",
        "code",
        "link",
        "image",
        "table",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        {
          name: "delete",
          action: onDelete,
          className: "fa fa-trash",
          title: "Delete",
        },
        {
          name: "save",
          action: () => onSave(simplemdeRef.current.value()),
          className: "fa fa-save",
          title: "Save",
        }]

    simplemdeRef.current = new SimpleMDE({
      element: document.getElementById("editor"),
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true,
      },
      toolbar,
      spellChecker: useSpellChecker,
      initialValue,
      autofocus: true,
      shortcuts: {
        drawTable: "Cmd-Alt-T"
      },
      insertTexts: {
        horizontalRule: ["", "\n\n-----\n\n"],
        image: ["![](http://", ")"],
        link: ["[", "](http://)"],
        table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n"],
      },
      autosave: {
        enabled: true,
        uniqueId: localSaveId,
        delay: 1000,
      },
      styleSelectedText: true,
      status: false
    })
    if (defaultView) setupDefaultView(defaultView)
    if (props.title) setupTitle(props.title)
    if (codeMirrorHandle) codeMirrorHandle(simplemdeRef.current.codemirror);
    if (simplemdeHandle) simplemdeHandle(simplemdeRef.current)
  }

  const setupTitle = (title) => {
    const titleContainer = document.createElement('div')
    const titleElement = document.createElement('h4')
    titleElement.innerText = props.title
    titleElement.style.margin = "8px 0px 8px 5px" 
    titleElement.style.display = "inline-block"
    titleContainer.appendChild(titleElement)
    if (props.onBack) {
        const backBtnElement = document.createElement('div')
        backBtnElement.innerHTML = '<i class="fa fa-arrow-left"></i>'
        backBtnElement.style.display = "inline-block"
        backBtnElement.style.cursor = "pointer"
        backBtnElement.style.backgroundColor = props.theme.toolbar.background
        backBtnElement.style.borderRadius = "5px"
        backBtnElement.style.padding = "5px"
        backBtnElement.style.color = props.theme.toolbar.color
        backBtnElement.style.cursor = "pointer"
        backBtnElement.addEventListener("click", props.onBack)
        titleContainer.prepend(backBtnElement)
    }
    document.getElementsByClassName("editor-toolbar")[0].prepend(titleContainer)
  }

  const setupDefaultView = (viewType) => {
      switch (viewType) {
        case 'fullscreen':{
          if (simplemdeRef.current.toolbarElements["fullscreen"]){
            simplemdeRef.current.toggleFullScreen()
          }
          break;
        }
        case 'preview':{
          if (simplemdeRef.current.toolbarElements["preview"]) {
            simplemdeRef.current.togglePreview()
          }
          break;
        }
        case 'side-by-side': {
          if (simplemdeRef.current.toolbarElements["side-by-side"]) {
            simplemdeRef.current.toggleSideBySide()
          }
          break;
        }
      }
  }

  const applyStyleOptions = () => {
    const header = document.getElementsByTagName('head')[0];
    const devkeepEditorThemeStyle = document.getElementById('devkeep-md-editor-theme');

    if (devkeepEditorThemeStyle) {
      const customStyleString = createThemeStyleSheet();
      devkeepEditorThemeStyle.innerHTML = customStyleString;
    } else {
      const customThemeStyle = document.createElement('style');
      customThemeStyle.id = "devkeep-md-editor-theme"
      const customStyleString = createThemeStyleSheet();
      customThemeStyle.innerHTML = customStyleString;
      header.appendChild(customThemeStyle);
    }

    if (props.useHighlightJS) {
      const highlightTheme = document.getElementById('devkeep-highlight-theme');
      const { highlightScript, highlightThemeStyle } = fetchHighlightJS();
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
  }

  const createThemeStyleSheet = () => {
    const { theme: { editor, preview, toolbar, cursorColor, height } } = props;
    let customStyleString = '';
    if (preview) customStyleString = createPreviewStyles(preview);
    if (toolbar) customStyleString = customStyleString + createToolbarStyles(toolbar);
    if (editor) {
      const editorStyle = `#editor-container .CodeMirror {
        background-color: ${editor.background || "white"} !important;
        color: ${editor.color || "black"} !important;
        height: ${height || "100%"};
      }
      #editor-container .CodeMirror .fullscreen {
        height: 100% !important
      }
      `
      customStyleString = customStyleString + editorStyle;
    }
    if (cursorColor) {
      customStyleString = customStyleString + `
        .CodeMirror-cursor {
            border-left: 1px solid ${cursorColor} !important;
          }
        `
    }
    return customStyleString;
  }

  const createPreviewStyles = ({ codeBlockBackground = "black", background = "white", color = "black", height = "100%" }) => {
    return `
    #editor-container .editor-preview-side pre {
      background: ${codeBlockBackground};
      padding: 5px
    }
    #editor-container .editor-preview-side {
      background-color: ${background} !important;
      color: ${color} !important;
    }
    #editor-container .editor-preview-side.fullscreen {
      background-color: ${background} !important;
      color: ${color} !important;
    }
    #editor-container .editor-preview {
      background-color: ${background} !important;
      color: ${color} !important;
      height: ${height} !important;
    }
    #editor-container .editor-preview pre {
      background: ${codeBlockBackground};
      padding: 5px
    }
    #editor-container .editor-preview.fullscreen {
      background-color: ${background} !important;
      color: ${color} !important;
    }
    #editor-container .editor-preview h1,
    #editor-container .editor-preview h2 {
      border-bottom: 1px solid ${color};
    }
    #editor-container .editor-preview-side h1,
    #editor-container .editor-preview-side h2 {
      border-bottom: 1px solid ${color};
    }
    #editor-container .editor-preview .fullscreen h1,
    #editor-container .editor-preview .fullscreen h2 {
      border-bottom: 1px solid ${color};
    }
    `
  }

  const createToolbarStyles = ({
    background = "white",
    color = "black",
    activeBtnColor = "black",
    activeBtnBackground = "white",
    disabledBtnColor = "gray",
    disabledBtnBackground = "white",
    height = "82px"
  }) => {
    return `
    #editor-container .editor-toolbar {
      background-color: ${background} !important;
      color: ${color} !important;
      height: ${height}
    }
    #editor-container .editor-toolbar.fullscreen {
      background-color: ${background} !important;
      color: ${color} !important;
      height: ${height}
    }
    #editor-container .editor-toolbar a {
      color: ${color} !important;
    }
    #editor-container .editor-toolbar a.active {
      color: ${activeBtnColor} !important;
      background: ${activeBtnBackground} !important;
    }
    #editor-container .editor-toolbar .fullscreen a {
      color: ${color} !important;
    }
    #editor-container .editor-toolbar .fullscreen a.active, a:hover {
      color: ${activeBtnColor} !important;
      background: ${activeBtnBackground} !important;
    }
    #editor-container .editor-toolbar.disabled-for-preview a:not(.no-disable) {
      color: ${disabledBtnColor} !important;
      background: ${disabledBtnBackground} !important;
    }
    `
  }

  const fetchHighlightJS = () => {

    const highlightScript = document.createElement("script");
    const highlightThemeStyle = document.createElement("link");

    highlightThemeStyle.rel = "stylesheet";
    highlightThemeStyle.id = "devkeep-highlight-theme";

    highlightScript.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/highlight.min.js"
    highlightScript.id = "devkeep-highlight-script"

    if (props.highlightTheme) {
      highlightThemeStyle.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/${props.highlightTheme}.min.css`
    } else {
      highlightThemeStyle.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/agate.min.css`
    }
    return { highlightScript, highlightThemeStyle };
  }

  const commandListener = e => {
    const keyCode = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
    const cmdUsed = window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;
    const cmdKeyPressed = keyCommands.includes(keyCode);
    if (cmdUsed && cmdKeyPressed) {
      e.preventDefault();
      cmdAction(keyCode);
    }
  };

  // cmd/ctrl (save(CMD+S), delete(CMD+D)) handler
  const cmdAction = keyCode => {
    switch (keyCode) {
      case 83: {
        if (onSave) {
          onSave(simplemdeRef.current.value());
        }
        break;
      }
      case 68: {
        if (onDelete) {
          onDelete();
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <div id="editor-container">
      <textarea id="editor">
      </textarea>
    </div>
  )
}

MarkdownEditor.propTypes = {
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  codeMirrorHandle: PropTypes.func,
  simplemdeHandle: PropTypes.func,
  initialValue: PropTypes.string,
  localSaveId: PropTypes.string,
  useSpellChecker: PropTypes.bool,
  useHighlightJS: PropTypes.bool,
  highlightTheme: PropTypes.string,
  theme: PropTypes.object,
  viewType: PropTypes.string,
  title: PropTypes.string,
  onBack: PropTypes.func
}

export default MarkdownEditor;



