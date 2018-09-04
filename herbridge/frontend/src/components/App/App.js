import React from "react";
import ReactDOM from "react-dom";
import TextField from '../TextField'

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="amal-app">
                <h1>Heritage Bridge</h1>
            </div>
        )
    }
}

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
