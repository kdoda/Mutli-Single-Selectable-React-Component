
import './App.css';
import React, { useState } from "react";
import faker from 'faker'
import CustomDropdown from "./components/CustomDropdown";
import Grid from '@material-ui/core/Grid';

//Change OPTIONS_NUM for random values for the dropdown
//Try for 100000
const OPTIONS_NUM = 100000
const allOptions = new Array(OPTIONS_NUM).fill().map((value, index) => `${faker.lorem.words(2)}-${index}`);

function App() {

  //you can add default selected options in this array
  const [selectedValues,setSelectedValues] = useState([]);
  //second Option selected bydefault
  const [selectedValue,setSelectedValue] = useState(allOptions[1]);

  //array with objects
  // const allOptionsWithObjects = useState([{ lowercase: "computer_science", uppercase: "Computer Science"}, { lowercase: "computer_engineering", uppercase: "Computer Engineering"}]);
  // const [selectedValueObj, setSelectedValueObj] = useState({ lowercase: "computer_science", uppercase: "Computer Science"});

  return (
    <div style={{ marginLeft: '20px' }}>
      <h2>MultiSelect Checkbox - Klevin Doda</h2>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <h3>Multi Select</h3>
          <CustomDropdown
            isMulti
            placeHolder="Hive Component"
            value={selectedValues}
            allOptions={allOptions}
            onChange={setSelectedValues}
          />
        </Grid>
        <Grid item xs={6}>
          <h3>Single Select</h3>
          <CustomDropdown
            value={selectedValue}
            allOptions={allOptions}
            onChange={setSelectedValue}
          />
        </Grid>

        {/* I tried to extend it to pass an array of objects but did not have enough time */}
        {/* <Grid item xs={4}>
          <h3>Array with objects</h3>
          <CustomDropdown
            value={selectedValueObj}
            mapOptionToKey={option => option.lowercase}
            mapOptionToLabel={option => option.uppercase}
            allOptions={allOptionsWithObjects}
            onChange={setSelectedValueObj}
          />
        </Grid> */}
      </Grid>
    </div>
  );
}

export default App;
