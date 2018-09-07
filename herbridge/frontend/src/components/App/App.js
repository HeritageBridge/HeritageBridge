import React from "react";
import ReactDOM from "react-dom";
import {hot} from 'react-hot-loader'
import Grid from '@material-ui/core/Grid'
import TargetResource from '../TargetResource'

// Main react component for frontend application
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="amal-app">
                <Grid container spacing={32} direction="column">
                    <Grid item>
                        <img src="static/frontend/logo-herbridge.svg" style={{
                                            margin: '0 auto',
                                            display: 'block'
                                        }} />
                    </Grid>
                    <Grid item>
                        <TargetResource/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

// Swap in the main react component in the "app" div
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : null;

// Export the app as a hot-reloadable component
export default hot(module)(App)
