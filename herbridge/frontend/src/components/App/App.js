import React from "react";
import ReactDOM from "react-dom";
import api from '../../lib/api'
import cookies from '../../utils/cookies'
import Collapse from '@material-ui/core/Collapse'
import {hot} from 'react-hot-loader'
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid'
import PhotoConfirmation from '../PhotoConfirmation'
import PhotoGridList from '../PhotoGridList'
import TargetResource from '../TargetResource'
import SubmissionBar from '../SubmissionBar'
import Login from '../Login'
import LogoHerBridge from '../Svg/logo-herbridge.svg';
import Svg from 'react-svg-inline'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import {fakeResources} from '../../data/fake.resources'
import {fakePhotoSections} from '../../data/fake.photo.sections'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {flatMap} from '../../utils/utils'
import moment from "moment";

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
      bottomMargin: 64,
      isLoggedIn: false,
      loginError: null,
      loginIsLoading: false,
      selectedPhotoConfirmationIndex: 0,
      selectedPhotoIndexes: null,
      selectedPhotos: [],
      selectedResource: null,
      photoEndDate: moment().toDate(),
      photoStartDate: moment().subtract(3, "days").toDate(),
    }
    
    this.resizeTimer = null
  }
  
  componentDidMount() {
    this.setState({
      isLoggedIn: cookies.isLoggedIn(),
      selectedPhotoIndexes: fakePhotoSections.map(() => []),
    })
    
    window.addEventListener("resize", this.handleWindowResize)
  }
  
  componentWillUnmount() {
    
    window.removeEventListener("resize", this.handleWindowResize)
    if (this.resizeTimer !== null) {
      clearTimeout(this.resizeTimer)
    }
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
    this.setState({
      photoStartDate: startDate,
      photoEndDate: endDate,
    })
  }
  
  handlePhotoSelectionChanged = (indexes) => {
    // Update the selected photos using the new indexes
    const newSelectedPhotos =
      flatMap(fakePhotoSections, (section, sectionIndex) => {
        return section.images.filter((image, imageIndex) => {
          return indexes[sectionIndex].includes(imageIndex)
        })
      })
    
    // Update the selected photo in the confirmation component
    const newSelectedPhotoConfirmationIndex = this.nextConfirmationIndex(newSelectedPhotos)
    
    // Update the state
    this.setState({
      bottomMargin: this.calculateBottomMargin(newSelectedPhotos),
      selectedPhotoIndexes: indexes,
      selectedPhotos: newSelectedPhotos,
      selectedPhotoConfirmationIndex: newSelectedPhotoConfirmationIndex,
    })
  }
  
  handlePhotoConfirmationClear = (index) => {
    // Update the selected photos using the new index
    const {selectedPhotos} = this.state
    const selectedPhoto = selectedPhotos[index]
    const newSelectedPhotos = selectedPhotos.filter(p => p !== selectedPhoto)
    
    // Update the selected indexes
    const newSelectedPhotoIndexes = fakePhotoSections.map(section => {
      const images = section.images
      let indexes = []
      for (let i = 0; i < images.length; i++) {
        newSelectedPhotos.indexOf(images[i]) !== -1 ? indexes.push(i) : 0
      }
      return indexes
    })
    
    // Update the selected photo in the confirmation component
    const newSelectedPhotoConfirmationIndex = this.nextConfirmationIndex(newSelectedPhotos)
    
    // Update the state
    this.setState({
      bottomMargin: this.calculateBottomMargin(newSelectedPhotos),
      selectedPhotoIndexes: newSelectedPhotoIndexes,
      selectedPhotos: newSelectedPhotos,
      selectedPhotoConfirmationIndex: newSelectedPhotoConfirmationIndex,
    })
  }
  
  handlePhotoConfirmationSelectionChanged = (index) => {
    this.setState({selectedPhotoConfirmationIndex: index})
  }
  
  handleWindowResize = () => {
    if (this.resizeTimer !== null) {
      clearTimeout(this.resizeTimer)
    }
    
    this.resizeTimer = setTimeout(() => {
      if (window !== undefined) {
        const bottomMargin = this.calculateBottomMargin()
        this.setState({bottomMargin})
      }
    }, 300)
  }
  
  calculateSubmissionHeight = (photos = this.state.selectedPhotos) => {
    let height = 0
    if (photos.length !== 0) {
      if (window.innerWidth >= 600) {
        height = SubmissionBar.MAX_HEIGHT_SM
      } else {
        height = SubmissionBar.MAX_HEIGHT_XS
      }
    }
    return height
  }
  
  calculateBottomMargin = (photos = this.state.selectedPhotos) => {
    return 64 + this.calculateSubmissionHeight(photos)
  }
  
  getParentMargin = () => {
    const bm = Math.max(64, this.state.bottomMargin)
    return `64px 32px ${bm}px 32px`
  }
  
  getLoginContent = () => {
    const {
      photoEndDate,
      photoStartDate,
      selectedPhotoIndexes,
      selectedPhotoConfirmationIndex,
      selectedPhotos,
      selectedResource,
    } = this.state
    const noPhotosSelected = selectedPhotos.length === 0
    return (
      <div>
        <div style={{
          margin: this.getParentMargin(),
          transition: 'margin-bottom 200ms'
        }}>
          <Grid
            container
            spacing={32}
            direction="column">
            <Grid item>
              <Svg
                svg={LogoHerBridge}
                style={{display: 'block', margin: '0 auto', width: 111}}/>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}>
              <TargetResource
                resources={fakeResources}
                onSearch={this.handleResourceSearch}
                onResourceSelected={this.handleResourceSelect}
                onResourceDeselected={this.handleResourceDeselect}
                selectedResource={selectedResource}
              />
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={32}>
                <Grid
                  item
                  xs={12}
                  sm={noPhotosSelected ? 12 : 6}>
                  <PhotoGridList
                    endDate={photoEndDate}
                    startDate={photoStartDate}
                    sections={fakePhotoSections}
                    selectedIndexes={selectedPhotoIndexes}
                    onDateRangeChanged={this.handlePhotoDateRangeChanged}
                    onSelectionChanged={this.handlePhotoSelectionChanged}/>
                </Grid>
                {noPhotosSelected ? <div/> :
                  <Grow in={!noPhotosSelected}>
                    <Grid
                      item
                      xs={12}
                      sm={6}>
                      <PhotoConfirmation
                        selectedIndex={selectedPhotoConfirmationIndex}
                        onClear={this.handlePhotoConfirmationClear}
                        onSelectionChanged={this.handlePhotoConfirmationSelectionChanged}
                        images={selectedPhotos}/>
                    </Grid>
                  </Grow>}
              </Grid>
            </Grid>
          </Grid>
        </div>
        <SubmissionBar
          imageCount={selectedPhotos.length}
          style={{
            transition: 'all 300ms',
            height: this.calculateSubmissionHeight(),
            opacity: noPhotosSelected ? 0 : 1,
          }}/>
      </div>
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
  
  nextConfirmationIndex = (newSelectedPhotos) => {
    const newSelectedPhotoCount = newSelectedPhotos.length
    const {selectedPhotoConfirmationIndex, selectedPhotos} = this.state
    let newSelectedPhotoConfirmationIndex = selectedPhotoConfirmationIndex
    if (selectedPhotos.length > 0) {
      const lastSelectedPhoto = selectedPhotos[selectedPhotoConfirmationIndex]
      newSelectedPhotoConfirmationIndex = newSelectedPhotos.indexOf(lastSelectedPhoto)
      const previousIndex = selectedPhotoConfirmationIndex - 1
      if (newSelectedPhotoConfirmationIndex === -1) {
        newSelectedPhotoConfirmationIndex = previousIndex > 0 ? previousIndex : 0
      }
    } else {
      newSelectedPhotoConfirmationIndex = 0
    }
    if (newSelectedPhotoConfirmationIndex >= newSelectedPhotoCount) {
      newSelectedPhotoConfirmationIndex = Math.max(0, newSelectedPhotoCount - 1)
    }
    return newSelectedPhotoConfirmationIndex
  }
  
  render() {
    const {isLoggedIn} = this.state
    return (
      <div>
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
