import React from "react";
import ReactDOM from "react-dom";
import api from '../../lib/api'
import cookies from '../../utils/cookies'
import {hot} from 'react-hot-loader'
import Grid from '@material-ui/core/Grid'
import PhotoConfirmation from '../PhotoConfirmation'
import PhotoGridList from '../PhotoGridList'
import TargetResource from '../TargetResource'
import Login from '../Login'
import LogoHerBridge from '../Svg/logo-herbridge.svg';
import Svg from 'react-svg-inline'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import {fakeResources} from '../../data/fake.resources'
import {fakePhotoSections} from '../../data/fake.photo.sections'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {flatMap} from '../../utils/utils'

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
    this.state = {
      isLoggedIn: false,
      loginError: null,
      loginIsLoading: false,
      selectedPhotoIndexes: null,
    }
  }
  
  componentDidMount() {
    this.setState({isLoggedIn: cookies.isLoggedIn()})
  }
  
  handleLoginSubmit = (password) => {
    let error = null
    if (password.length === 0) {
      error = "Field is required"
    }
    
    if (error !== null) {
      this.setState({
        loginError: error,
        loginIsLoading: false,
      })
    } else {
      this.setState({
        loginError: null,
        loginIsLoading: true,
      })
      
      let state = {
        loginError: null,
        loginIsLoading: false,
      }
      
      api.login(password)
      .then(token => {
        cookies.setToken(token)
        state.isLoggedIn = cookies.isLoggedIn()
        this.setState(state)
      })
      .catch(error => {
        state.loginError = error.message
        state.isLoggedIn = false
        this.setState(state)
      })
    }
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
    this.setState({selectedPhotoIndexes: indexes})
  }
  
  getLoginContent = () => {
    const {selectedPhotoIndexes} = this.state
    return (
      <Grid
        container
        spacing={32}
        direction="column">
        <Grid item>
          <Svg
            svg={LogoHerBridge}
            style={{ display: 'block', margin: '0 auto', width: 111 }}/>
        </Grid>
        <Grid item>
          <TargetResource
            resources={fakeResources}
            onSearch={this.handleResourceSearch}
            onResourceSelected={this.handleResourceSelect}
            onResourceDeselected={this.handleResourceDeselect}/>
        </Grid>
        <Grid item>
          <Grid
            container
            spacing={32}>
            <Grid
              item
              xs={6}>
              <PhotoGridList
                sections={fakePhotoSections}
                selectedIndexes={selectedPhotoIndexes}
                onDateRangeChanged={this.handlePhotoDateRangeChanged}
                onSelectionChanged={this.handlePhotoSelectionChanged} />
            </Grid>
            <Grid item xs={6}>
              <PhotoConfirmation images={ flatMap( fakePhotoSections,  (section, sectionIndex) => {
                const sectionSelectedPhotoIndexes = selectedPhotoIndexes ? selectedPhotoIndexes[sectionIndex] : []
                return section.images.filter( (image, imageIndex) => {
                  return sectionSelectedPhotoIndexes.includes(imageIndex)
                })
              })}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
  
  getLoginForm = () => {
    const {loginIsLoading, loginError} = this.state
    return (
      <Grid container spacing={32} direction="column">
        <Grid item>
          <Svg svg={LogoHerBridge} style={{display: 'block', margin: '0 auto', width: 111}}/>
        </Grid>
        <Grid item>
          <Login
            error={loginError}
            isLoading={loginIsLoading}
            onSubmit={this.handleLoginSubmit}/>
        </Grid>
      </Grid>
    )
  }
  
  render() {
    const {isLoggedIn} = this.state
    return (
      <div style={{margin: '64px 32px'}}>
        <MuiThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            {isLoggedIn ? this.getLoginContent() : this.getLoginForm()}
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
