import React from "react"
import { useEffect } from "react"
import PropTypes from 'prop-types';
import SimpleMDE from "simplemde"
import "./static/mde.css";
import "./static/custom.css";


const keyCommands = [83, 69, 79];
let simplemde;


const MarkdownEditor = (props) => {

  const { onSave, onDelete, initialValue, localSaveId, useSpellChecker } = props;

  useEffect(() => {
    setUpSimpleMDE(initialValue);
    document.addEventListener('keydown', commandListener);


    return () => document.removeEventListener('keydown', commandListener);
  }, [initialValue])

  const setUpSimpleMDE = (initialValue) => {
    simplemde = new SimpleMDE({
      element: document.getElementById("editor"),
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true,
      },
      toolbar: [
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
          action: onSave,
          className: "fa fa-save",
          title: "Save",
        }
      ],
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
    })
    applyStyleOptions();
  }

  const applyStyleOptions = () => {
    const { theme: { editor, preview, toolbar, cursorColor } } = props;
    const header = document.getElementsByTagName('head')[0];
    const customThemeStyle = document.createElement('style');
    customThemeStyle.innerHTML = `
      .editor-preview-side pre {
        background: ${preview.codeBlockBackground};
        padding: 5px
      }
      .editor-preview-side {
        background-color: ${preview.background} !important;
        color: ${preview.color} !important;
      }
      .editor-preview-side.fullscreen {
        background-color: ${preview.background} !important;
        color: ${preview.color} !important;
      }
      .editor-preview {
        background-color: ${preview.background} !important;
        color: ${preview.color} !important;
      }
      .editor-preview pre {
        background: ${preview.codeBlockBackground};
        padding: 5px
      }
      .editor-preview.fullscreen {
        background-color: ${preview.background} !important;
        color: ${preview.color} !important;
      }
      .editor-preview h1, h2 {
        border-bottom: 1px solid ${preview.color};
      }
      .editor-preview.fullscreen h1, h2 {
        border-bottom: 1px solid ${preview.color};
      }
      .editor-toolbar {
        background-color: ${toolbar.background} !important;
        color: ${toolbar.color} !important;
      }
      .editor-toolbar.fullscreen {
        background-color: ${toolbar.background} !important;
        color: ${toolbar.color} !important;
      }
      .editor-toolbar a {
        color: ${toolbar.color} !important;
      }
      .editor-toolbar a.active {
        color: ${toolbar.activeBtnColor} !important;
        background: ${toolbar.activeBtnBackground} !important;
      }
      .editor-toolbar.fullscreen a {
        color: ${toolbar.color} !important;
      }
      .editor-toolbar.fullscreen a.active, a:hover {
        color: ${toolbar.activeBtnColor} !important;
        background: ${toolbar.activeBtnBackground} !important;
      }
      .editor-toolbar.disabled-for-preview a:not(.no-disable) {
        color: ${toolbar.disabledBtnColor} !important;
        background: ${toolbar.disabledBtnBackground} !important;
      }
      .CodeMirror {
        background-color: ${editor.background} !important;
        color: ${editor.color} !important;
      }
      .CodeMirror-cursor {
        border-left: 1px solid ${cursorColor} !important;
      }
    `
    header.appendChild(customThemeStyle);
    if (props.useHighlightJS) {
      const { highlightScript, highlightThemeStyle } = fetchHighlightJS();
      header.appendChild(highlightThemeStyle);
      header.appendChild(highlightScript);
    }
  }

  const fetchHighlightJS = () => {
    const highlightScript = document.createElement("script");
    const highlightThemeStyle = document.createElement("link");
    highlightThemeStyle.rel = "stylesheet";
    highlightScript.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/highlight.min.js"
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
          onSave(simplemde.value());
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
  initialValue: PropTypes.string,
  localSaveId: PropTypes.string,
  useSpellChecker: PropTypes.bool,
  useHighlightJS: PropTypes.bool,
  highlightTheme: PropTypes.string,
  theme: PropTypes.object,
}

export default MarkdownEditor;



