import React from "react";
import { MainContext } from '../context/MainContext';
import validateForm from '../utils/validateForm';
import { accessMsg } from '../utils/helper';
import Checkbox from './Checkbox';
import NextButton from './NextButton';
import { getCheckbox } from '../utils/getContextValues';

// Signer address Information is stored as object inside array.
// Object contains two keys, address and error. e.g {address:'0x23...', error:true}
// Error key is set to true/false during address form validation.

function hasError(arrObj) {
  const length = arrObj.length;
  let hasError;
  if (length) {
    for (let i = 0; i < length; i++) {
      if (arrObj[i].error === true) {
        hasError = true;
        return hasError;
      }
    }
  }
  hasError = false;
  return hasError;
}

class signerListForm extends React.Component {

  handleChange = (e) => {
    const context = this.context;
    const { web3 } = context.loadWeb3;
    let slf = { ...context.signerListForm };
    const targetId = e.target.dataset.id;

    // Form className is 'address'
    const className = e.target.className;
    const error = 'error';
    const address = e.target.value;
    const validate = validateForm(web3, address, slf.signerInfo);
    slf.signerInfo[targetId][className] = address.trim();
    slf.signerInfo[targetId][error] = validate.errorMsg;
    slf.anyError = validate.anyError;
    slf.nextBtn.value = false;
    slf.nextBtn.disable = false;
    this.updateMainContext(slf);
  }

  updateMainContext = (data) => {
    const context = this.context;
    context.updateSignerListForm(data);
  }

  checkBoxLogic = () => {

    const context = this.context;

    const slFirstValue = getCheckbox(context, 'signerListForm', 'firstLabel')
    // const slFirstLabel = slf.checkbox.name.firstLabel;
    // const slFirstValue = slf.checkbox.values[slFirstLabel];

    //signerListForm(slf)
    let slf = { ...context.signerListForm };

    if (slFirstValue && slf.signerInfo.length === 0) {

      // Form initialization process.
      // Error key is set to true because empty address is consider invalid.
      const newField = { address: '', error: true };

      // Display first input field.
      slf.signerInfo = [...slf.signerInfo, newField];

      // Show Add New Signer button.
      slf.displayAddBtn = true;
      slf.openSig = false;
      this.updateMainContext(slf);
    }
  }

  addAddress = (e) => {
    // SignerListForm(slf)
    let slf = { ...this.context.signerListForm };
    // Disable Add New Button.
    // It will be set to false if entered address is valid.
    slf.anyError = true;
    slf.nextBtn.value = false;
    slf.nextBtn.disable = false;

    const newField = { address: '', error: true };
    slf.signerInfo = [...slf.signerInfo, newField];

    this.updateMainContext(slf);
  }

  // Delete button logic
  deleteAddress = (e) => {
    let context = this.context;
    let signerListForm = { ...context.signerListForm }
    let signerInfo = [...signerListForm.signerInfo];
    signerInfo.splice(e.target.dataset.id, 1);
    signerListForm.signerInfo = signerInfo;

    // This conidition will execute if the user delete the last remaining address by pressing delete button.
    if (signerInfo.length === 0) {
      // Hide Add New Signer button.
      signerListForm.displayAddBtn = false;

      // Disable Add New Signer button.
      signerListForm.anyError = true;

      // Reset SignerListForm checkbox values.
      signerListForm.checkbox.values = {};

      this.updateMainContext(signerListForm);

    } else {
      const errorExist = hasError(signerInfo);
      if (!errorExist) {
        signerListForm.anyError = false;
      }
      this.updateMainContext(signerListForm);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
  }

  render() {
    const context = this.context;
    const slSecondValue = getCheckbox(context, 'signerListForm', 'secondLabel')
    let { signerInfo, anyError, displayAddBtn } = context.signerListForm
    let addNewBtn;
    let nextBtn;
    let proceedMsg;

    if (displayAddBtn) {
      addNewBtn = <button id="add-new-btn" onClick={this.addAddress} disabled={anyError}>Add new signer</button>
    } else {
      addNewBtn = null;
    }

    if (slSecondValue) {
      proceedMsg = 'Proceed to Step4 below.';
    } else {
      proceedMsg = null;
    }

    // Show/Hide confirm button.
    if (signerInfo.length > 0 && !hasError(signerInfo)) {
      nextBtn = (
        <div>
          <p>Continue updating address or Click Next to proceed to Step4 below.</p>
          <NextButton toUpdate='signerListForm' />
        </div>
      )
    } else {
      nextBtn = null;
    }

    const signHashNxtBtn = context.signHash.nextBtn;

    let signerListRender;
    if (signHashNxtBtn.value) {
      signerListRender = (
        <div>
          <Checkbox checkboxName='signerListForm' updateFunction='updateSignerListCheckBox' />
          <br />
        </div>
      );
    } else {
      signerListRender = accessMsg('2');
    }

    const emptyErr = (
      <span style={{ color: "red" }}>Address field should not be empty, please delete or enter correct address</span>
    );

    const addressForm = (
      <div>
        <form onSubmit={this.handleSubmit}>
          {
            signerInfo.map((val, idx) => {
              const signerId = `signer-${idx}`;
              return (
                <div key={idx}>
                  <label htmlFor={signerId}>{`signer #${idx + 1}`}</label>
                  <input
                    type="text"
                    name={signerId}
                    data-id={idx}
                    id={signerId}
                    placeholder="ethereum address"
                    value={signerInfo[idx].address}
                    className="address"
                    onChange={this.handleChange}
                  />
                  {signerInfo.length >= 0 ? (
                    <button data-id={idx} id={`btn-${signerId}`} className='del-btn' onClick={this.deleteAddress} >Delete</button>
                  ) : (
                      null
                    )}
                  <br />
                  <span id={`error-${idx}`} style={{ color: "red" }}>{signerInfo[idx].error}</span>
                  {signerInfo[idx].address.length === 0 ? emptyErr : null}
                </div>
              );
            })
          }
        </form>
        <div id="add-new-btn">
          {addNewBtn}
        </div>
        <div>
        </div>
      </div>
    )
    return (
      <div>
        {signerListRender}
        {addressForm}
        {nextBtn}
        {proceedMsg}
      </div>
    );
  }
}

signerListForm.contextType = MainContext;

export default signerListForm;
