import React from "react";
import ReactDOM from "react-dom";
import {hot} from 'react-hot-loader'
import Grid from '@material-ui/core/Grid'
import PhotoGridList from '../PhotoGridList'
import TargetResource from '../TargetResource'
import LogoHerBridge from '../Svg/logo-herbridge.svg';
import Svg from 'react-svg-inline'

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

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
  
  handleResourceSearch = (query) => {
    console.log('search', query)
  }
  
  handleResourceSelect = (resource) => {
    console.log('select', resource.name)
  }
  
  handleResourceDeselect = (resource) => {
    console.log('deselect', resource.name)
  }
  
  render() {
    return (
      <div className="amal-app" style={{ margin: 32 }}>
        <MuiThemeProvider theme={theme}>
          <Grid container spacing={32} direction="column">
            <Grid item>
              <Svg svg={LogoHerBridge} style={{ display: 'block', margin: '0 auto', width: 111 }}/>
            </Grid>
            <Grid item>
              <TargetResource onSearch={this.handleResourceSearch} onResourceSelected={this.handleResourceSelect} onResourceDeselected={this.handleResourceDeselect}/>
            </Grid>
            <Grid item>
              <PhotoGridList />
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
