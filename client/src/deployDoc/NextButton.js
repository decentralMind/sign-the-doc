import React from 'react';
import { MainContext } from '../context/MainContext';

class NextButton extends React.Component {

    updateMainContext = () => {
        const context = this.context;
        const toUpdate = this.props.toUpdate;
        context.updateNextButton(toUpdate);
    }

    render() {
        const toUpdate = this.props.toUpdate;
        const btnDisable = this.context[toUpdate].nextBtn.disable;
        return (
            <div>
                <button onClick={this.updateMainContext} disabled={btnDisable}>Next>></button>
            </div>
        );
    }
}

export default NextButton;

NextButton.contextType = MainContext;
