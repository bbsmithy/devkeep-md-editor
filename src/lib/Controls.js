import * as React from 'react';
import { FaBold, FaCode, FaQuoteRight, FaListOl, FaListUl, FaItalic } from 'react-icons/fa';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles(() => ({
  btnControl: {
    cursor: 'pointer',
    display: 'inline-block',
    '&:focus': {
      outline: 'none'
    }
  },
  controlsContainer: {
    width: '100%'
  }
}))


const Controls = props => {

  const classes = useStyles();

  return (
    <div style={props.controlsContainer} className={classes.controlsContainer}>
      <button value='H1' style={props.buttonStyle} className={classes.btnControl} onClick={props.onSelectControl}>
        H1
      </button>
      <button value='H2' style={props.buttonStyle} className={classes.btnControl} onClick={props.onSelectControl}>
        H2
      </button>
      <button value='H3' style={props.buttonStyle} className={classes.btnControl} onClick={props.onSelectControl}>
        H3
      </button>
      <button value='H4' style={props.buttonStyle} className={classes.btnControl} onClick={props.onSelectControl}>
        H4
      </button>
      <button value='CODE' style={props.buttonStyle} className={classes.btnControl} onClick={props.onSelectControl}>
        <FaCode />
      </button>
      <button value='BLOCKQUOTE' style={props.buttonStyle} className={classes.btnControl} onClick={props.onSelectControl}>
        <FaQuoteRight />
      </button>
      <button value='BOLD' style={props.buttonStyle} className={classes.btnControl} onClick={props.onSelectControl}>
        <FaBold />
      </button>
      <button value='ITALIC' style={props.buttonStyle} className={classes.btnControl} onClick={props.onSelectControl}>
        <FaItalic />
      </button>
      <button value='OL' style={props.buttonStyle} className={classes.btnControl} onClick={props.onSelectControl}>
        <FaListOl />
      </button>
      <button value='UL' style={props.buttonStyle} className={classes.btnControl} onClick={props.onSelectControl}>
        <FaListUl />
      </button>
    </div>
  );
};

export default Controls;
