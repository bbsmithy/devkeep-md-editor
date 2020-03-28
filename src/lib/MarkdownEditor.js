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
      (e.keyCode === 83 || e.keyCode === 68 || e.keyCode === 86)
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
        case 86: {
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
