"use strict";

import React from "react";
import ReactMapGL, {NavigationControl} from "react-map-gl";
import Paper from '@material-ui/core/Paper'
import SearchBar from 'material-ui-search-bar'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'mapbox-gl/dist/mapbox-gl.js'

export default class extends React.Component {
  mapboxAccessToken = "pk.eyJ1IjoiaGFyaXNhbWFsIiwiYSI6ImNqazl2ODA0MTBlY2szcW1pcWhvemhzMG8ifQ.P_vJ5xocOJXPDkFp2xsyvg"
  mapboxUri = "mapbox://styles/mapbox/satellite-streets-v10"
  
  state = {
    viewport: {
      width: 100,
      height: 100,
      latitude: 30.2807022,
      longitude: -97.9108343,
      zoom: 11
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
  
  handleNavigationControlViewportChange = (viewport) => {
    this.setState({viewport})
  }
  
  handleSearchRequest = () => {
    console.log('handle search', this.state.query)
  }
  
  handleSearchQueryChange = (query) => {
    this.setState({ query })
  }
  
  _resize = () => {
    let newWidth = this.containerDiv.getBoundingClientRect().width
    let newHeight = this.containerDiv.getBoundingClientRect().height
    this.setState({
      viewport: Object.assign(this.state.viewport, {
        height: newHeight,
        width: newWidth,
      })
    });
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
          <div style={{position: 'relative'}}>
            <div style={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 1,
            }}>
              <SearchBar
                placeholder="Search"
                value={this.state.query}
                onChange={this.handleSearchQueryChange}
                onRequestSearch={this.handleSearchRequest}/>
            </div>
          </div>
          <ReactMapGL
            {...this.state.viewport}
            mapboxApiAccessToken={this.mapboxAccessToken}
            mapStyle={this.mapboxUri}
            onViewportChange={viewport => this.setState({viewport})}>
            <div style={{
              position: 'absolute',
              right: 16,
              top: 16
            }}>
              <NavigationControl onViewportChange={this.handleNavigationControlViewportChange}/>
            </div>
          </ReactMapGL>
        </div>
      </Paper>
    );
  }
}
