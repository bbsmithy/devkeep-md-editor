import * as React from "react";
import "./MarkdownEditor.css";

const MarkdownIt = require("markdown-it");

const md = new MarkdownIt({
  html: true // Enable HTML tags in source
});

export default class MdEditor extends React.Component {
  constructor(props) {
    super(props);

    this.mdContainerRef = React.createRef();
    this.htmlContainerRef = React.createRef();

    this.state = {
      html: ""
    };
  }

  createHTML = markdown => {
    return md.render(markdown);
  };

  onChangeMarkdown = evt => {
    const html = this.createHTML(evt.currentTarget.value);
    this.setState({
      html
    });
  };

  onScrollMDContainer = evt => {
    this.htmlContainerRef.current.scrollTop = this.mdContainerRef.current.scrollTop;
  };

  onScrollHTMLContainer = evt => {
    this.mdContainerRef.current.scrollTop = this.htmlContainerRef.current.scrollTop;
  };

  render() {
    return (
      <div className="mainContainer" style={{ height: this.props.height }}>
        <div className="markdownContainer">
          <textarea
            className="markdownEditor"
            onScroll={this.onScrollMDContainer}
            ref={this.mdContainerRef}
            onChange={this.onChangeMarkdown}
          ></textarea>
        </div>
        <div
          className="htmlContainer"
          onScroll={this.onScrollHTMLContainer}
          ref={this.htmlContainerRef}
        >
          {this.state.html && (
            <div dangerouslySetInnerHTML={{ __html: this.state.html }}></div>
          )}
        </div>
      </div>
    );
  }
}
