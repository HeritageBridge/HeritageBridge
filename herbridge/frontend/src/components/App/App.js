import React from "react";
import ReactDOM from "react-dom";
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import SearchOutlined from '@material-ui/icons/SearchOutlined'
import {hot} from 'react-hot-loader'

// Main react component for frontend application
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="amal-app">
                <h1>Heritage Bridge</h1>
                <TextField label="EAMENA Resource No." InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchOutlined/>
                        </InputAdornment>
                    ),
                }}/>
            </div>
        )
    }
}

// Swap in the main react component in the "app" div
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : null;

// Export the app as a hot-reloadable component
export default hot(module)(App)
