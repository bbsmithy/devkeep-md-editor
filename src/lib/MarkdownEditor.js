import React from "react"
import { useEffect } from "react"
import PropTypes from 'prop-types';
import SimpleMDE from "simplemde"
import "./static/mde.css";
import "./static/custom.css";
import "./static/github-light.css";


const keyCommands = [83, 69, 79];
let simplemde;


const MarkdownEditor = (props) => {

  const { onSave, onDelete, onOpenInsert, initialValue, localSaveId, spellChecker } = props;

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
      spellChecker: spellChecker,
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
    const { editorTheme, previewTheme, toolbarTheme } = props;
    const customThemeStyle = document.createElement('style');
    customThemeStyle.innerHTML = `
      .editor-preview-side {
        background-color: ${previewTheme.background} !important;
        color: ${previewTheme.color} !important;
      }
      .editor-preview-side.fullscreen {
        background-color: ${previewTheme.background} !important;
        color: ${previewTheme.color} !important;
      }
      .editor-preview {
        background-color: ${previewTheme.background} !important;
        color: ${previewTheme.color} !important;
      }
      .editor-preview.fullscreen {
        background-color: ${previewTheme.background} !important;
        color: ${previewTheme.color} !important;
      }
      .editor-toolbar {
        background-color: ${toolbarTheme.background} !important;
        color: ${toolbarTheme.color} !important;
      }
      .editor-toolbar.fullscreen {
        background-color: ${toolbarTheme.background} !important;
        color: ${toolbarTheme.color} !important;
      }
      .editor-toolbar a {
        color: ${toolbarTheme.color} !important;
      }
      .CodeMirror {
        background-color: ${editorTheme.background} !important;
        color: ${editorTheme.color} !important;
      }
    `
    const header = document.getElementsByTagName('head')[0];
    header.appendChild(customThemeStyle);
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
      case 79: {
        if (onOpenInsert) {
          onOpenInsert(simplemde.codemirror);
        }
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
  onOpenInsert: PropTypes.func,
  initialValue: PropTypes.string,
  localSaveId: PropTypes.string,
  spellChecker: PropTypes.bool,
  editorTheme: PropTypes.object,
  previewTheme: PropTypes.object,
  toolbarTheme: PropTypes.object
}

export default MarkdownEditor;



