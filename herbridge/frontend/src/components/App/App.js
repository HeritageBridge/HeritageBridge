import React from "react";
import ReactDOM from "react-dom";
import {hot} from 'react-hot-loader'
import Grid from '@material-ui/core/Grid'
import PhotoGridList from '../PhotoGridList'
import TargetResource from '../TargetResource'
import Login from '../Login'
import LogoHerBridge from '../Svg/logo-herbridge.svg';
import Svg from 'react-svg-inline'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'

import { fakeResources } from '../../data/fake.resources'
import { fakePhotoSections } from '../../data/fake.photo.sections'

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
    this.state = {}
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
  
  handlePhotoDateRangeChanged = (startDate, endDate) => {
    console.log('date range changed', startDate, endDate)
  }
  
  handlePhotoSelectionChanged = (indexes) => {
    console.log('handle photo selection changed', indexes)
  }
  
  render() {
    return (
      <div style={{ margin: '64px 32px' }}>
        <MuiThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid container spacing={32} direction="column">
              <Grid item>
                <Svg svg={LogoHerBridge} style={{ display: 'block', margin: '0 auto', width: 111 }}/>
              </Grid>
              {/*<Grid item>*/}
                {/*<TargetResource resources={fakeResources} onSearch={this.handleResourceSearch} onResourceSelected={this.handleResourceSelect} onResourceDeselected={this.handleResourceDeselect}/>*/}
              {/*</Grid>*/}
              {/*<Grid item>*/}
                {/*<PhotoGridList sections={fakePhotoSections} onDateRangeChanged={this.handlePhotoDateRangeChanged} onSelectionChanged={this.handlePhotoSelectionChanged} />*/}
              {/*</Grid>*/}
            </Grid>
            <Login/>
          </MuiPickersUtilsProvider>
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
