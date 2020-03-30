import * as React from 'react';
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
  return (
    <div className='controls-container'>
      <button value='H1' onClick={props.onSelectControl}>
        H1
      </button>
      <button value='H2' onClick={props.onSelectControl}>
        H2
      </button>
      <button value='H3' onClick={props.onSelectControl}>
        H3
      </button>
      <button value='H4' onClick={props.onSelectControl}>
        H4
      </button>
      <button value='CODE' onClick={props.onSelectControl}>
        Code
      </button>
      <button value='BLOCKQUOTE' onClick={props.onSelectControl}>
        Blockqoute
      </button>
      <button value='OL' onClick={props.onSelectControl}>
        OL
      </button>
      <button value='UL' onClick={props.onSelectControl}>
        UL
      </button>
    </div>
  );
};

export default Controls;