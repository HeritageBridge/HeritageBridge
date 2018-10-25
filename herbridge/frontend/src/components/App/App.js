import React from "react";
import ReactDOM from "react-dom";
import api from '../../lib/api'
import cookies from '../../utils/cookies'
import {hot} from 'react-hot-loader'
import GeoJSON from 'geojson'
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid'
import Map from '../Map'
import PhotoConfirmation from '../PhotoConfirmation'
import PhotoGridList from '../PhotoGridList'
import TargetResource from '../TargetResource'
import SubmissionBar from '../SubmissionBar'
import Login from '../Login'
import LogoHerBridge from '../Svg/logo-herbridge.svg';
import Svg from 'react-svg-inline'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
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
  /* Static variables */
  static MIN_BOTTOM_MARGIN = 32

  /* Instance variables */
  resizeTimer = null


  constructor(props) {
    super(props);
    this.state = {
      bottomMargin: App.MIN_BOTTOM_MARGIN,
      isLoading: false,
      isLoadingResources: false,
      isLoggedIn: false,
      loginError: null,
      loginIsLoading: false,
      selectedPhotoConfirmationIndex: 0,
      selectedPhotoIndexes: null,
      selectedPhotos: [],
      selectedResource: null,
      photoEndDate: moment().toDate(),
      photoStartDate: moment().subtract(3, "days").toDate(),
      resources: [],
      resourcesFiltered: [],
      resourcesFilterQuery: '',
      viewport: {
        latitude: 26.669568563483807,
        longitude: 37.48028071919893,
        zoom: 8,
      }
    }
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

  calculateBottomMargin = (photos = this.state.selectedPhotos) => {
    return App.MIN_BOTTOM_MARGIN + this.calculateSubmissionBarHeight(photos)
  }

  calculateSubmissionBarHeight = (photos = this.state.selectedPhotos) => {
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

  handleResourceFilter = (filter) => {
    let resourcesFiltered = []
    const resources = this.state.resources
    if (resources.length > 0) {
      resourcesFiltered = resources.filter(resource => {
        return resource.resource_name
          .toLowerCase()
          .includes(filter.toLowerCase())
      })
    }
    this.setState({resourcesFiltered, resourcesFilterQuery: filter})
  }

  handleResourceSelect = (resource) => {
    this.setState({selectedResource: resource})
  }

  handleResourceDeselect = (resource) => {
    this.setState({selectedResource: null})
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

  handleSubmissionBarSubmit = () => {
    console.log('submit')
  }

  handleSubmissionBarArchive = () => {
    console.log('archive')
  }

  handleMapBoundsChange = (bounds) => {
    const polygon = GeoJSON.parse(bounds, {'Polygon': 'polygon'})

    // Make sure we don't have a resource currently selected
    const {selectedResource} = this.state
    if (selectedResource !== null) {
      return
    }

    // Start loading
    this.setState({
      isLoadingResources: true,
      resourcesFiltered: [],
      resourcesFilterQuery: '',
    })

    // Call EAMENA API using GeoJSON polygon
    api.getResources(polygon.geometry)
      .then(resources => {
        this.setState({isLoadingResources: false, resources})
      })
      .catch(error => {
        this.setState({isLoadingResources: false})
      })
  }

  handleMapViewportChange = (viewport) => {
    this.setState({viewport})
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

  getLoginContent = () => {
    const {
      isLoading,
      isLoadingResources,
      photoEndDate,
      photoStartDate,
      resources,
      resourcesFiltered,
      resourcesFilterQuery,
      selectedPhotoIndexes,
      selectedPhotoConfirmationIndex,
      selectedPhotos,
      selectedResource,
      viewport,
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
            spacing={App.MIN_BOTTOM_MARGIN}
            direction="column">
            <Grid item>
              <Svg
                svg={LogoHerBridge}
                style={{
                  display: 'block',
                  margin: '0 auto',
                  width: 111,
                }}/>
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={App.MIN_BOTTOM_MARGIN}>
                <Grid
                  item
                  xs={12}
                  sm={7}
                  style={{zIndex: 0}}>
                  <Map
                    resources={resourcesFiltered.length > 0 ? resourcesFiltered : resources}
                    selectedResource={selectedResource}
                    viewport={viewport}
                    onBoundsChanged={this.handleMapBoundsChange}
                    onViewportChanged={this.handleMapViewportChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}>
                  <TargetResource
                    filter={resourcesFilterQuery}
                    isLoading={isLoadingResources}
                    resources={resourcesFiltered.length > 0 ? resourcesFiltered : resources}
                    onFilter={this.handleResourceFilter}
                    onResourceSelected={this.handleResourceSelect}
                    onResourceDeselected={this.handleResourceDeselect}
                    selectedResource={selectedResource}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={App.MIN_BOTTOM_MARGIN}>
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
          isLoading={isLoading}
          onArchive={this.handleSubmissionBarArchive}
          onSubmit={this.handleSubmissionBarSubmit}
          resource={selectedResource}
          style={{
            transition: 'all 300ms',
            height: this.calculateSubmissionBarHeight(),
            opacity: noPhotosSelected ? 0 : 1,
          }}/>
      </div>
    )
  }

  getLoginForm = () => {
    const {loginIsLoading, loginError} = this.state
    return (
      <Grid container spacing={App.MIN_BOTTOM_MARGIN} direction="column">
        <Grid item style={{
          marginTop: App.MIN_BOTTOM_MARGIN
        }}>
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

  getParentMargin = () => {
    const bm = Math.max(App.MIN_BOTTOM_MARGIN, this.state.bottomMargin)
    return `${App.MIN_BOTTOM_MARGIN}px ${App.MIN_BOTTOM_MARGIN}px ${bm}px ${App.MIN_BOTTOM_MARGIN}px`
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
