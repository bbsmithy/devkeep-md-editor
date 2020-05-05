import * as React from 'react';
import { ReactComponent as CodeIcon } from './code-solid.svg';
import { ReactComponent as BoldIcon } from './bold-solid.svg';
import { ReactComponent as ItalicIcon } from './italic-solid.svg';
import { ReactComponent as OLIcon } from './list-ol-solid.svg';
import { ReactComponent as ULIcon } from './list-ul-solid.svg';
import { ReactComponent as BlockQuoteIcon } from './quote-right-solid.svg';
import './Controls.css';

// H1 H2 H3 H4
// H1 -> # (TEXT)
// H2 -> ## (TEXT)
// H3 -> ### (TEXT)
// H4 -> #### (TEXT)

// </> -> ```lang (CODE)  ```
// Blockqoute -> > (TEXT)
//               > (TEXT)
// OL -> 1. (TEXT)
//       2. (TEXT)
// UL -> * (TEXT)
//       * (TEXT)

const Controls = props => {
  const onChangeLanguage = evt => {
    props.onChangeLanguage(evt.target.value);
  };
  return (
    <div style={props.controlsContainer} className="controls-container">
      <button value='H1' style={props.buttonStyle} onClick={props.onSelectControl}>
        H1
      </button>
      <button value='H2' style={props.buttonStyle} onClick={props.onSelectControl}>
        H2
      </button>
      <button value='H3' style={props.buttonStyle} onClick={props.onSelectControl}>
        H3
      </button>
      <button value='H4' style={props.buttonStyle} onClick={props.onSelectControl}>
        H4
      </button>
      <button value='CODE' style={props.buttonStyle} onClick={props.onSelectControl}>
        <CodeIcon height={12} width={12} />
      </button>
      <input
        placeholder='Language'
        onChange={onChangeLanguage}
        style={props.langStyle}
      />
      <button value='BLOCKQUOTE' style={props.buttonStyle} onClick={props.onSelectControl}>
        <BlockQuoteIcon height={12} width={12} />
      </button>
      <button value='BOLD' style={props.buttonStyle} onClick={props.onSelectControl}>
        <BoldIcon height={12} width={12} />
      </button>
      <button value='ITALIC' style={props.buttonStyle} onClick={props.onSelectControl}>
        <ItalicIcon height={12} width={12} />
      </button>
      <button value='OL' style={props.buttonStyle} onClick={props.onSelectControl}>
        <OLIcon height={12} width={12} />
      </button>
      <button value='UL' style={props.buttonStyle} onClick={props.onSelectControl}>
        <ULIcon height={12} width={12} />
      </button>
    </div>
  );
};

export default Controls;
