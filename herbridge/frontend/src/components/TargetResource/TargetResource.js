import React from "react";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import TargetResourceList from './TargetResourceList'

export default class TargetResource extends React.Component {
  static defaultProps = {
    onSearch: (query) => {},
    onResourceSelected: (resource) => {},
    onResourceDeselected: (resource) => {},
    resources: [
      {
        id: 'b0000000-0000-0000-0000-000000000001',
        name: 'Castle Dumas',
        notes: 'nice old castle',
        images: [
          {
            id: 'e0000000-0000-0000-0000-000000000001',
            url: '/media/sample/geotagged-photo-hongkong.jpg',
            thumbnailUrl: '/media/CACHE/images/sample/geotagged-photo-hongkong/64e937a5a56f0b2ba489a82a55aeb691.jpg',
            latitude: 29.963477,
            longitude: 31.255325,
            captureDate: 1291044716,
            caption: 'stairs in hong kong (coordinates in Egypt)'
          }
        ],
        condition: '',
        type: 'area',
        hazards: true,
        safetyHazards: false,
        interventionRequired: true
      },
      {
        id: 'b0000000-0000-0000-0000-000000000002',
        name: 'Dumas Keep',
        notes: 'this is the stronghold of the castle and buildings a few great staircases',
        images: [
          {
            id: 'e0000000-0000-0000-0000-000000000002',
            url: '/media/sample/_DSC1014.JPG',
            thumbnailUrl: '/media/CACHE/images/sample/_DSC1014/e92a02cb73693ab1ee20a75e8f67f00b.JPG',
            latitude: 30.3232,
            longitude: 32.1,
            captureDate: 1267371056,
            caption: null
          }
        ],
        condition: '',
        type: 'building',
        hazards: true,
        safetyHazards: false,
        interventionRequired: true
      },
      {
        id: 'b0000000-0000-0000-0000-000000000003',
        name: 'North Staircase',
        notes: 'modeled after stairs in Hong Kong',
        images: [
          {
            id: 'e0000000-0000-0000-0000-000000000003',
            url: '/media/sample/_DSC1029.JPG',
            thumbnailUrl: '/media/CACHE/images/sample/_DSC1029/b029cbb1b40c510afb0f1564d2182895.JPG',
            latitude: 29.53477,
            longitude: 31.34325,
            captureDate: 1322579576,
            caption: 'more stairs in hong kong (coordinates in Egypt)'
          }
        ],
        condition: '',
        type: 'object',
        hazards: false,
        safetyHazards: false,
        interventionRequired: false
      },
      {
        id: 'b0000000-0000-0000-0000-000000000004',
        name: 'South Staircase',
        notes: 'modeled after stairs in Hong Kong',
        images: [
          {
            id: 'e0000000-0000-0000-0000-000000000004',
            url: '/media/sample/2017-02-27-StairTypes-296.jpg',
            thumbnailUrl: '/media/CACHE/images/sample/2017-02-27-StairTypes-296/a43a9bf69ef0b61c9064b04ffad4c4fb.jpg',
            latitude: 29.965,
            longitude: 31.125325,
            captureDate: 1291391156,
            caption: null
          },
          {
            id: 'e0000000-0000-0000-0000-000000000005',
            url: '/media/sample/2017-02-27-StairTypes-337.jpg',
            thumbnailUrl: '/media/CACHE/images/sample/2017-02-27-StairTypes-337/737e52ea2bb33db522c6658ab0da05cc.jpg',
            latitude: 29.913477,
            longitude: 31.325325,
            captureDate: 1270553456,
            caption: null
          }
        ],
        condition: '',
        type: 'object',
        hazards: false,
        safetyHazards: false,
        interventionRequired: false
      }
    ]
  }
  
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }
  
  handleResourceSearchChange = (event) => {
    this.setState({query: event.target.value})
  };
  
  handleResourceSearchEnter = () => {
    this.props.onSearch(this.state.query)
  };
  
  handleResourceSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleResourceSearchEnter()
    }
  };
  
  handleResourceSelected = (resource) => {
    this.props.onResourceSelected(resource)
  };
  
  handleResourceDeselected = (resource) => {
    this.props.onResourceDeselected(resource)
  };
  
  render() {
    return (
      <Paper style={{maxWidth: 480, margin: '0 auto'}}>
        <div className="amal-target-resource" style={{minHeight: 100, padding: 32}}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Typography variant="subheading">EAMENA Resources</Typography>
            </Grid>
            <Grid item xs={6} style={{display: 'table-cell', verticalAlign: 'middle'}}>
              <img src="/media/frontend/logo-eamena.svg" style={{display: 'block', margin: '6px 0 0 auto'}}/>
            </Grid>
          </Grid>
          <Grid container spacing={8} direction="column" style={{marginTop: 16}}>
            <Grid item xs={12}>
              <TextField
                placeholder="EAMENA-XXXXXX"
                onChange={this.handleResourceSearchChange}
                onKeyPress={this.handleResourceSearchKeyPress}
                style={{width: '100%'}}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined/>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TargetResourceList
                resources={this.props.resources}
                onSelect={this.handleResourceSelected}
                onDeselect={this.handleResourceDeselected}
              />
            </Grid>
          </Grid>
        </div>
      </Paper>
    )
  }
}
