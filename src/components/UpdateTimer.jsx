import React from 'react';

class Counter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            counter: 60,
            counter_interval: 0
        }
    }

    counter() {
        let count = this.state.counter === 0 ? 59 : this.state.counter - 1
        this.setState({counter:count})
    }

    componentDidMount() {
        let counter_interval = setInterval(this.counter.bind(this), 1000);

        this.setState({
            counter_interval:counter_interval,
        });
    }

    render() {
        return (
            <div>
            <span>
            <p id="timer">Next update in: {this.state.counter}</p>
            </span>
            </div>
        )
    }
}

export default Counter;