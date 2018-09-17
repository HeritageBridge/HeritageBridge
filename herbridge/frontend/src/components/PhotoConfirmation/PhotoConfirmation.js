import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ListSubheader from "@material-ui/core/ListSubheader"
import LogoAmalInHeritage from '../Svg/logo-amal-in-heritage.svg'
import Svg from 'react-svg-inline'
import Typography from "@material-ui/core/Typography/Typography";
import CheckCircleRounded from "@material-ui/icons/CheckCircleRounded"
import bs from 'binary-search'
import moment from 'moment'

import { InlineDatePicker } from 'material-ui-pickers/DatePicker'

export default class extends React.Component {
  indexBinarySearchComparator = (a,b) => (a - b)
  indexSortComparator = (a, b) => (a > b)
  
  static defaultProps = {
    images: [],
    onSelectionChanged: (selectedIndex) => {},
  }
  
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: -1
    }
  }
  
  handleImageToggle = (image, index) => {
    console.log('handle image toggle', index)
  }
  
  isImageAtIndexSelected = (index) => {
    return false
  }
  
  render() {
    console.log('images', this.props.images)
    
    return (
      <Paper style={{height: '100%', margin: '0 auto'}}>
        <div className="amal-confirmation" style={{minHeight: 100, padding: 32}}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Typography variant="subheading">Confirm</Typography>
            </Grid>
          </Grid>
          <GridList cellHeight={115} cols={6}>
              {this.props.images.map((image, index) => (
                <GridListTile key={image.id} cols={1} style={{width: 115}}>
                  <ButtonBase style={{height: 115, width: 115}}
                              onClick={this.handleImageToggle.bind(this, image, index)}>
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
                      opacity: this.isImageAtIndexSelected(index) ? 0.75 : 1
                    }}/>
                    {this.isImageAtIndexSelected(index) ?
                      <CheckCircleRounded style={{position: 'absolute', top: 16, right: 16, fill: '#fff'}}/> : <div/>}
                  </ButtonBase>
                </GridListTile>
              ))}
            </GridList>
        </div>
      </Paper>
    )
  }
}