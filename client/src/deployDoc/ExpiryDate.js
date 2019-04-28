import React from "react";
import DatePicker from "react-datepicker";
import { MainContext } from '../context/MainContext';
import moment from 'moment';
import Checkbox from './Checkbox';
import { accessMsg, proceedMsg } from '../utils/helper';

import "react-datepicker/dist/react-datepicker.css";
import NextButton from "./NextButton";

import { getCheckbox } from '../utils/getContextValues';

class ExpiryDate extends React.Component {
  handleChange = (date) => {
    const context = this.context;
    var inputDate = moment(date);
    let expiryDate = { ...context.expiryDate };
    expiryDate.selectedDate = inputDate.toDate();
    expiryDate.unixDate = moment(date).unix();
    context.updateExpiryDate(expiryDate);
  }

  handleClick = () => {
    const context = this.context;
    const { expiryDate } = context;
    context.updateExpiryDate(expiryDate);
  }

  render() {
    //Expiry date checkbox values.
    const context = this.context
    const { expiryDate } = this.context;

    //Expiry Date CheckBox label 'yes' of expiryDate checkbox
    const exFirstValue = getCheckbox(context, 'expiryDate', 'firstLabel');
    //Expiry DAte Checkbox label 'no' of expiryDate checkbox.
    const exSecondValue = getCheckbox(context, 'expiryDate', 'secondLabel');

    const slSecondValue = getCheckbox(context, 'signerListForm', 'secondLabel');

    //SignerList checkbox values.
    const slf = this.context.signerListForm;

    const slNextBtn = slf.nextBtn.value;

    let selectedDate;
    let showNext;
    let dateField;
    let showCheckbox;
    let currentDate = moment().toDate();

    if (slSecondValue || slNextBtn) {
      showCheckbox = (
        <div>
          <Checkbox checkboxName='expiryDate' updateFunction='resetExpiryDate' />
        </div>
      );
    } else {
      showCheckbox = accessMsg('3');
    }

    //Update the DatePicker field with selected date.
    //Initial date with be current date.
    if (expiryDate.selectedDate) {
      selectedDate = expiryDate.selectedDate;
    } else {
      selectedDate = moment().toDate();
    }

    //When ExpiryDate component checkboxy label 'yes' is selected.
    if (exFirstValue) {
      dateField = (
        <div>
          <div>
            <p>Please select the expiry date.</p>
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={this.handleChange}
            showTimeSelect
            timeFormat="h:mm"
            timeIntervals={15}
            dateFormat="d/MM/yyyy h:mm aa"
            minDate={currentDate}
            timeCaption="time"
          />
        </div>
      );
    } else {
      dateField = null;
    }

    //Entered date is converted to unix time stamp and recorded into the contract.
    const nextBtn = <NextButton toUpdate='expiryDate' />
    if (expiryDate.unixDate && exFirstValue) {
      const expiryDate = moment(selectedDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
      showNext = (
        <div>
          <p>Expiry Date: <strong>{expiryDate}</strong></p>
          <p>Unix timestamp: <strong>{expiryDate.unixDate}</strong></p>
          {proceedMsg('Step4')}
          {nextBtn}
        </div>
      );
    } else if (exSecondValue) {
      showNext = (
        <div>
          {proceedMsg('Step4')}
          {nextBtn}
        </div>
      );
    }
    return (
      <div>
        {showCheckbox}
        {dateField}
        {showNext}
      </div >
    );
  }
}

ExpiryDate.contextType = MainContext;

export default ExpiryDate;
