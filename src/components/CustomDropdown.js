import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import { FixedSizeList as List } from "react-window";
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import "../styles.css";
import IconButton from '@material-ui/core/IconButton';

/**
 * CURRENTLY the component acceps an array of strings. 
 * I tried to extend it for objects but did not have enough time.
 * Hive Custom Dropdown without using <select> <option> etc.
 * NOTE: If 'isMulti' the checkbox will appear next to the label
 * and if you click on a row the dropdown will not close
 * Else for Single selection no checkbox will be displayed and dropdown
 * will be closed on click
 * Anytime you can click out of the dropdown to close it.
 * @param {React.node} el
 * @param {boolean} initialState
 */
function CustomDropdown(props) {

 const {
    allOptions,
    value,
    isMulti,
    placeHolder,
    boxWidth,
    mapOptionToKey,
    mapOptionToLabel,
    boxHeight,
    rowHeight
  } = props;

  const dropdownRef = useRef(null);
  //custom hook created to close dropdown when clicking out of it
  const [isOpened, setIsOpened] = useDetectOutsideClick(dropdownRef, false);
  const isAllSelected = () => value.length === allOptions.length;

  const onClickRow = (changedValue, e) => {
    //TODO get label map function from prop
    if (isMulti) {
      //do not close dropdown on multiselect
      //do not bubble up
      e.stopPropagation();

      const index = value.findIndex((val) => mapOptionToKey(val) === mapOptionToKey(changedValue));

      //for fast lookup we could use HashSet but React relies on immutability to detect changes and update DOM
      //what is why we do a deep copy
      let newSelectedValues = [...value]
      if (index !== -1) { //if exist it means deselecting
        newSelectedValues.splice(index, 1); //remove from array
      } else {
        //if we want to preserve order a lookup of indexes can be used
        newSelectedValues.push(changedValue) //add it in the end
      }
      //pass array of selected values to parent component
      props.onChange(newSelectedValues);
    } else {
      //pass the selected value as string to parent component
      props.onChange(changedValue) 
    }
  }

  const onClickAll = (e) => {
    
    if (isMulti) {
      //do not close dropdown on multiselect
      //do not bubble up
      e.stopPropagation();

      props.onChange(isAllSelected() ? [] : [...allOptions]);
    } else {
      props.onChange('All')
    }
  }

  const Row = ({ index, style }) => {
    //Explanation
    //There are two way to hanlde 'Select All' case
    //1. we can concat ['Select All', ...allOptions] but performance will degradade for large arrays
    //2. we dynamically render 'Select All' button, index 0 is the stimulated position of 'Select All' row
    
    //ignore Select All
    let optionIndex = index - 1;
    return (
      <div>
      <div key={index} style={style} className="post">
        {index === 0 ? //Select All case
        //TODO can be moved to a component maybe
          <Button
            fullWidth={true}
            style={{justifyContent: "flex-start", height: rowHeight}}
            onClick={onClickAll}
          >
              {isMulti &&
              <Checkbox
                  checked={isAllSelected()}
                  onClick={onClickAll}
                  name={'All'}
                  color="primary"
              />
              }
              {isMulti ? isAllSelected() ? 'Deselect All' : 'Select All' : 'All'}
          </Button>
      :
      <Button
          fullWidth={true}
          style={{justifyContent: "flex-start", height: rowHeight, backgroundColor: !isMulti && allOptions[optionIndex] === value ? 'lightgray' : '' }}
          onClick={(e) => onClickRow(allOptions[optionIndex], e)}
        >
          {isMulti &&
          <Checkbox
              checked={value.some((val) => val === allOptions[optionIndex])}
              onClick={(e) => onClickRow(allOptions[optionIndex], e)}
              name={allOptions[optionIndex]}
              color="primary"
          />
          }
          {mapOptionToLabel(allOptions[optionIndex])}
        </Button>}
      </div>
      </div>
    )
  }

  // TODO we could use chips array instead of csv for displayed values
  const getTextToDisplay = () => {
    if(value.length === 0) {
      return placeHolder
    } else if (isMulti){
      return isAllSelected() ? 'All values are selected' : value.join(',')
    } else {
      return value
    }
  }
 
    return (
      <div className="wrapper">
        <div className="container" >
            {getTextToDisplay()}
            <IconButton onClick={() => setIsOpened(!isOpened)} style={{float: 'right'}}>
                {isOpened ? <KeyboardArrowUpIcon  /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </div>
          {/* Conditionally DOM rendering*/}
          {isOpened && 
          <div
            ref={dropdownRef}
            className="dropdown"
          >
            {/* Use Windowing technique for large dataset */}
            <List
                width={boxWidth}
                height={boxHeight}
                itemCount={allOptions.length + 1} // + 1 for Select All, do not concat because is slow for large lists
                itemSize={rowHeight}
            >
              {Row}
            </List>
          </div>}
      </div>
    );
}

CustomDropdown.defaultProps = {
  allOptions: [],
  value: '',
  placeHolder: 'Please select a value',
  isMulti: false,
  mapOptionToLabel: option => option, //use the data for no complex object
  mapOptionToKey: option => option,
  styles: {},
  boxWidth: 320,
  boxHeight: 230,
  rowHeight: 55,
};

CustomDropdown.propTypes = {
  /**
   * Array that holds all the options to be displayed in the dropdown.
   */
  allOptions: PropTypes.array.isRequired,
  /**
   * Selected value(s) of the dropdown. 
   * If 'isMulti' is true (multiselectable) value should be an array.
   * Else it should be a single string.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
   /**
   * String to be displayed in the container box of dropdown when no value is selected. 
   */
  placeHolder: PropTypes.string,
  /**
   * Boolean flag to transform the dropdown into a multiselectable one. 
   */
  isMulti: PropTypes.bool,
  /**
   * A mapping function to get the field of data to be displayed in the drodownrows
   * If no mapOptionToLabel func passed component assumes that the data passed is an array of strings
   */
   mapOptionToLabel: PropTypes.func,
   /**
   * A mapping function to get the field of data to be compare on when (de)selecting from the drodownrows
   * If no mapOptionToKey func passed component assumes that the data passed is an array of strings
   */
  mapOptionToKey: PropTypes.func,
  /**
   * Callback fired every time selected value(s) change
   * If 'isMulti' params passed is array of selected values
   *    If 'Select All' is clicked allOptions is passed as values 
   *    If 'Deselect All' is clicked empty array is passed as values
   * @param {T[]} 
   * If is single select the params passed is a string
   *    If 'All' is clicked 'All' is passed
   * @param {string} 
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Width of the dropdown box. 
   */
  boxWidth: PropTypes.number,
  /**
   * Height of the dropdown box. 
   */
  boxHeight: PropTypes.number,
  /**
   * Height of each row in the dropdown box. 
   */
  rowHeight: PropTypes.number,
};

export default CustomDropdown;