import React from 'react';
import { MainContext } from '../context/MainContext';

function hasKey(obj, key) {
  if (obj.hasOwnProperty(key))
    return true;
  return false;
}

function setRestFalse(obj, setKey) {
  for (var key in obj) {
    if (key !== setKey) {
      obj[key] = false
    }
  }
  return obj;
}

class checkbox extends React.Component {

  handleInputChange = (event) => {
    const context = this.context;
    // Replace the content here
    const checkboxName = this.props.checkboxName;
    let checkbox = { ...context[checkboxName].checkbox.values };
    const name = event.target.name;

    let newState;

    if (!checkbox) {
      newState = {
        [name]: true
      }
      this.updateCheckBoxContext(newState);
    } else if (!hasKey(checkbox, name)) {
      checkbox[name] = true;
      newState = setRestFalse(checkbox, name);
      this.updateCheckBoxContext(newState);
    } else if (!checkbox[name]) {
      checkbox[name] = true;
      newState = setRestFalse(checkbox, name);
      this.updateCheckBoxContext(newState);
    }
  }

  updateCheckBoxContext = (data) => {
    const context = this.context;
    const updateFunction = this.props.updateFunction;
    context[updateFunction](data);
  }

  render() {
    // Receive function through props from Context Provider to update Main Context State
    const checkboxName = this.props.checkboxName;
    const checkbox = this.context[checkboxName].checkbox;

    // Get checkbox label name.
    const firstLabel = checkbox.name.firstLabel;
    const secondLabel = checkbox.name.secondLabel;

    // Store checkbox respective value.
    let firstValue = checkbox.values[firstLabel];
    let secondValue = checkbox.values[secondLabel];

    return (
      <div>
        <form>
          <label>
            {firstLabel}
            <input
              name={firstLabel}
              type="checkbox"
              checked={firstValue ? firstValue : false}
              onChange={this.handleInputChange} />
          </label>
          <br />
          <label>
            {secondLabel}
            <input
              name={secondLabel}
              type="checkbox"
              checked={secondValue ? secondValue : false}
              onChange={this.handleInputChange} />
          </label>
          <br />
        </form>
      </div>
    );
  }
}

checkbox.contextType = MainContext;

export default checkbox;
