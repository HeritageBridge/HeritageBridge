"use strict";

import React from "react";
import Geocoder from 'react-map-gl-geocoder'
import ReactMapGL, {NavigationControl, LinearInterpolator, TRANSITION_EVENTS} from "react-map-gl";
import Paper from '@material-ui/core/Paper'
import 'mapbox-gl/dist/mapbox-gl.css'
import {debounce} from '../../utils/utils'

export default class extends React.Component {
  interpolator = new LinearInterpolator()
  mapboxAccessToken = "pk.eyJ1IjoiaGFyaXNhbWFsIiwiYSI6ImNqazl2ODA0MTBlY2szcW1pcWhvemhzMG8ifQ.P_vJ5xocOJXPDkFp2xsyvg"
  mapboxUri = "mapbox://styles/mapbox/satellite-streets-v10"
  mapRef = React.createRef()
  viewportTimer = null
  
  static defaultProps = {
    onViewportChanged: (viewport) => {
    }
  }
  
  state = {
    viewport: {
      width: 100,
      height: 100,
      latitude: 30.2807022,
      longitude: -97.9108343,
      zoom: 11,
    },
    query: ""
  };
  
  componentDidMount() {
    window.addEventListener("resize", this._resize);
    this._resize();
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this._resize);
  }
  
  handleSearchRequest = () => {
    console.log('handle search', this.state.query)
  }
  
  handleSearchQueryChange = (query) => {
    this.setState({query})
  }
  
  handleViewportChangeForNavigationControl = (viewport) => {
    const newViewport = viewport
    this.setState({viewport: newViewport})
    this.queueViewportChangeEvent()
  }
  
  handleViewportChangeForGeocoder = (viewport) => {
    const newViewport = Object.assign(this.state.viewport, viewport)
    this.setState({
      viewport: Object.assign(newViewport, {
        transitionDuration: 0,
        transitionInterruption: TRANSITION_EVENTS.BREAK,
      })
    })
    this.queueViewportChangeEvent()
  }
  
  handleViewportChangeForMap = (viewport) => {
    const newViewport = viewport
    this.setState({viewport: newViewport})
    this.queueViewportChangeEvent()
  }
  
  setNewViewport = (viewport) => {
    this.setState({
      viewport: Object.assign(viewport, {
        transitionDuration: 0,
        transitionInterruption: TRANSITION_EVENTS.BREAK,
      })
    })
  }
  
  queueViewportChangeEvent = () => {
    if (this.viewportTimer !== undefined) {
      clearTimeout(this.viewportTimer)
    }
    this.viewportTimer = setTimeout(() => {
      const {viewport} = this.state
      this.props.onViewportChanged(viewport)
      this.viewportTimer = null
    }, 300)
  }
  
  _resize = () => {
    const {height, width} = this.containerDiv.getBoundingClientRect()
    const viewport = Object.assign(this.state.viewport, {height, width})
    this.setState({viewport});
  };
  
  render() {
    return (
      <Paper style={{height: '100%'}}>
        <div
          ref={containerDiv => {
            this.containerDiv = containerDiv
          }}
          style={{
            height: '100%',
            width: '100%',
          }}>
          <ReactMapGL
            {...this.state.viewport}
            mapboxApiAccessToken={this.mapboxAccessToken}
            mapStyle={this.mapboxUri}
            ref={this.mapRef}
            scrollZoom={false}
            touchZoom={false}
            onViewportChange={this.handleViewportChangeForMap}>
            <Geocoder
              mapboxApiAccessToken={this.mapboxAccessToken}
              mapRef={this.mapRef}
              onViewportChange={this.handleViewportChangeForGeocoder}
            />
            <div style={{
              position: 'absolute',
              right: 10,
              bottom: 10
            }}>
              <NavigationControl onViewportChange={this.handleViewportChangeForNavigationControl}/>
            </div>
          </ReactMapGL>
        </div>
      </Paper>
    );
  }
}
