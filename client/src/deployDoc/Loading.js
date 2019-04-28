import React from 'react';

class Loading extends React.Component {
    state = {
        loadingMsg: ''
    }

    componentDidMount = () => {
        this.loading = setInterval(() => {
            let loadingMsg = this.state.loadingMsg;
            if (!loadingMsg) {
                loadingMsg = '.';
            } else if (loadingMsg === '.') {
                loadingMsg = '..';
            } else if (loadingMsg === '..') {
                loadingMsg = '...';
            } else if (loadingMsg === '...') {
                loadingMsg = '....'
            } else {
                loadingMsg = ''
            }
            this.setState({
                loadingMsg: loadingMsg
            })
        }, 100);
    }

    componentWillUnmount() {
        clearInterval(this.loading);
    }

    render() {
        return (
            <div>
                <h3>{this.state.loadingMsg}</h3>
            </div>
        )
    }
}

export default Loading;