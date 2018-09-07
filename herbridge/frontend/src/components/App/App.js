import React from "react";
import ReactDOM from "react-dom";
import {hot} from 'react-hot-loader'
import Grid from '@material-ui/core/Grid'
import TargetResource from '../TargetResource'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
const theme = createMuiTheme({
  palette: {
    primary: {
        main: '#008FED'
    },
    secondary: {
        main: '#f44336',
    },
  },
});

// Main react component for frontend application
class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="amal-app">
                <MuiThemeProvider theme={theme}>
                    <Grid container spacing={32} direction="column">
                        <Grid item>
                            <img src="static/frontend/logo-herbridge.svg" style={{ margin: '0 auto', display: 'block' }} />
                        </Grid>
                        <Grid item>
                            <TargetResource/>
                        </Grid>
                    </Grid>
                </MuiThemeProvider>
            </div>
        )
    }
}

// Swap in the main react component in the "app" div
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : null;

// Export the app as a hot-reloadable component
export default hot(module)(App)
