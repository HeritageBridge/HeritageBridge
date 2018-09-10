import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ListSubheader from "@material-ui/core/ListSubheader"
import Typography from "@material-ui/core/Typography/Typography";
import CheckCircleRounded from "@material-ui/icons/CheckCircleRounded"
import {formattedDateStringFromISOString} from "../../utils/utils"

export default class extends React.Component {
  static defaultProps = {
    sections: [
      {
        date: "1989-08-24T05:00:00.000Z",
        images: [{
          id: 'e0000000-0000-0000-0000-000000000001',
          url: '/media/sample/geotagged-photo-hongkong.jpg',
          thumbnailUrl: '/media/CACHE/images/sample/geotagged-photo-hongkong/64e937a5a56f0b2ba489a82a55aeb691.jpg',
          latitude: 29.963477,
          longitude: 31.255325,
          captureDate: 1291044716,
          caption: 'stairs in hong kong (coordinates in Egypt)'
        }]
      },
      {
        date: "2004-02-04T06:00:00.000Z",
        images: [{
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
          }]
      },
      {
        date: "2008-05-15T06:00:00.000Z",
        images: [{
          id: 'e0000000-0000-0000-0000-000000000002',
          url: '/media/sample/_DSC1014.JPG',
          thumbnailUrl: '/media/CACHE/images/sample/_DSC1014/e92a02cb73693ab1ee20a75e8f67f00b.JPG',
          latitude: 30.3232,
          longitude: 32.1,
          captureDate: 1267371056,
          caption: null
        },
          {
            id: 'e0000000-0000-0000-0000-000000000003',
            url: '/media/sample/_DSC1029.JPG',
            thumbnailUrl: '/media/CACHE/images/sample/_DSC1029/b029cbb1b40c510afb0f1564d2182895.JPG',
            latitude: 29.53477,
            longitude: 31.34325,
            captureDate: 1322579576,
            caption: 'more stairs in hong kong (coordinates in Egypt)'
          }]
      }
    ],
    onSelect: (image) => {
    },
    onSelectAll: (images) => {
    },
    onDeselect: (image) => {
    },
    onDeselectAll: (images) => {
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      selected: []
    }
  }
  
  handleToggleImageSection = (sectionIndex) => {
    console.log(`toggle section ${sectionIndex}`)
    
    // const { images } = this.props
    // const { selected } = this.state
    // if (selected.length < images.length) {
    //   this.setState({ selected: images.slice() })
    //   this.props.onSelectAll(images)
    // } else {
    //   this.setState({ selected: [] })
    //   this.props.onDeselectAll(images)
    // }
  }
  
  handleToggleImage = (image, index, sectionIndex) => {
    // console.log(`toggle image ${index} of section ${sectionIndex}`, image.url)
    
    let { selected } = this.state
    let current = selected[sectionIndex]
    // console.log('current', current)
    
    if (current === undefined) {
      
      // initialize, skip straight to adding it
      selected[sectionIndex] = [];
      selected[sectionIndex].push(index)
      this.setState({ selected });
      
    } else if (current.indexOf(index) !== -1) {
    
      // already inside, remove
      selected[sectionIndex] = current.filter(i => i !== index)
      this.setState({ selected });
      
    } else {
    
      // not inside, add
      current.push(index)
      selected[sectionIndex] = current
      this.setState({ selected })
    
    }
    
    console.log('selected', this.state)
    // let { selected } = this.state
    // const index = selected.indexOf(image)
    // if (index === -1) {
    //   selected.push(image)
    // } else {
    //   selected.splice(index, 1)
    // }
    // this.setState({ selected })
    // if (index === -1) {
    //   this.props.onSelect(image)
    //   console.log('select', image)
    // } else {
    //   this.props.onDeselect(image)
    //   console.log('deselect', image)
    // }
  }
  
  render() {
    const {sections} = this.props
    const {selected} = this.state
    return (
      <Paper style={{maxWidth: 608, margin: '0 auto'}}>
        <div className="amal-target-resource" style={{minHeight: 100, padding: 32}}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Typography variant="subheading">Amal in Heritage</Typography>
            </Grid>
            <Grid item xs={6} style={{display: 'table-cell', verticalAlign: 'middle'}}>
              <img src="static/frontend/logo-amal-in-heritage.svg" style={{display: 'block', margin: '6px 0 0 auto'}}/>
            </Grid>
          </Grid>
          {sections.map((section, sectionIndex) => (
            <GridList key={section.date} cellHeight={115} cols={6}>
              <GridListTile cols={6} style={{height: 'auto'}}>
                <ListSubheader component="div" style={{padding: 0}}>
                  <Checkbox
                    color="primary"
                    onChange={this.handleToggleImageSection.bind(this, sectionIndex)}
                    checked={false}
                  />
                  {formattedDateStringFromISOString(section.date)}
                </ListSubheader>
              </GridListTile>
              {section.images.map((image, index) => (
                <GridListTile key={image.thumbnailUrl} cols={1} style={{width: 115}}>
                  <ButtonBase style={{height: 115, width: 115}}
                              onClick={this.handleToggleImage.bind(this, image, index, sectionIndex)}>
                    <div className="overlay" style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      backgroundColor: '#000'
                    }}/>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      backgroundImage: `url(${image.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center 40%',
                      opacity: selected.indexOf(image) !== -1 ? 0.75 : 1
                    }}/>
                    {selected.indexOf(image) !== -1 ?
                      <CheckCircleRounded style={{position: 'absolute', top: 16, right: 16, fill: '#fff'}}/> : <div/>}
                  </ButtonBase>
                </GridListTile>
              ))}
            </GridList>
          ))}
        </div>
      </Paper>
    )
  }
}