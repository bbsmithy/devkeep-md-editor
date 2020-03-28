import * as React from 'react';
import './MarkdownEditor.css';

const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({
  html: true // Enable HTML tags in source
});

export default class MdEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      html: '',
      md: '',
      displayMD: true
    };
  }

  commandListener = e => {
    if (
      (window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) &&
      (e.keyCode === 83 || e.keyCode === 68 || e.keyCode === 75)
    ) {
      e.preventDefault();
      switch (e.keyCode) {
        case 83: {
          console.log('SAVE');
          break;
        }
        case 68: {
          console.log('DELETE');
          break;
        }
        case 75: {
          this.setState({
            displayMD: !this.state.displayMD
          });
          break;
        }
      }
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.commandListener);
  }

  createHTML = markdown => {
    return md.render(markdown);
  };

  onChangeMarkdown = evt => {
    const html = this.createHTML(evt.currentTarget.value);
    this.setState({
      html,
      md: evt.currentTarget.value
    });
  };

  // onTab = (o, e) => {
  //   var kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
  //   if (kC == 9 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
  //     var oS = o.scrollTop;
  //     if (o.setSelectionRange) {
  //       var sS = o.selectionStart;
  //       var sE = o.selectionEnd;
  //       o.value = o.value.substring(0, sS) + '\t' + o.value.substr(sE);
  //       o.setSelectionRange(sS + 1, sS + 1);
  //       o.focus();
  //     } else if (o.createTextRange) {
  //       document.selection.createRange().text = '\t';
  //       e.returnValue = false;
  //     }
  //     o.scrollTop = oS;
  //     if (e.preventDefault) {
  //       e.preventDefault();
  //     }
  //     return false;
  //   }
  //   return true;
  // };

  render() {
    return (
      <div
        className='mainContainer'
        style={{
          height: this.props.height,
          ...this.props.styles.mainContainer
        }}
      >
        {this.state.displayMD && (
          <div
            className='markdownContainer'
            style={this.props.styles.markdownContainer}
          >
            <textarea
              className='markdownEditor'
              // onKeyDown='insertTab(this, event)'
              style={this.props.styles.markdownEditor}
              onChange={this.onChangeMarkdown}
            >
              {this.state.md}
            </textarea>
          </div>
        )}
        {!this.state.displayMD && (
          <div
            className='htmlContainer'
            style={this.props.styles.htmlContainer}
          >
            {this.state.html && (
              <div dangerouslySetInnerHTML={{ __html: this.state.html }}></div>
            )}
          </div>
        )}
      </div>
    );
  }
}
