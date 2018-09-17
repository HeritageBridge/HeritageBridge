import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Typography from "@material-ui/core/Typography/Typography";
import CheckCircleRounded from "@material-ui/icons/CheckCircleRounded"
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';

export default class extends React.Component {
  static defaultProps = {
    images: [],
    selectedIndex: 0,
    onSelectionChanged: (selectedIndex) => {
    },
  }
  
  constructor(props) {
    super(props)
  }
  
  handleImageSelected = (image, index) => {
    this.props.onSelectionChanged(index)
  }
  
  handleImageIndexChanged = (index) => {
    console.log('handle image index changed', index)
    this.props.onSelectionChanged(index)
  }
  
  handleBack = (index) => {
    console.log('back', index)
    this.props.onSelectionChanged(this.props.selectedIndex - 1)
  }
  
  handleNext = (index) => {
    console.log('next', index)
    this.props.onSelectionChanged(this.props.selectedIndex + 1)
  }
  
  isImageAtIndexSelected = (index) => {
    return this.props.selectedIndex === index
  }
  
  render() {
    return (
      <Paper style={{height: '100%', margin: '0 auto'}}>
        <div style={{minHeight: 100}}>
          <Typography variant="subheading" style={{padding: '24px'}}>Confirm</Typography>
          <SwipeableViews
            index={this.props.selectedIndex}
            onChangeIndex={this.handleImageIndexChanged}
            enableMouseEvents={true}>
            {this.props.images.map(image => {
              return <img
                key={image.id}
                src={image.url}
                style={{
                  height: 452,
                  objectFit: 'cover',
                  overflow: 'hidden',
                  width: '100%',
                }}/>
            })}
          </SwipeableViews>
          <Grid container style={{width: 200, margin: '0 auto'}}>
            <Grid item>
              <Button size="small" onClick={this.handleBack} disabled={this.props.selectedIndex === 0}>
                {<KeyboardArrowLeft/>}
              </Button>
            </Grid>
            <Grid item>
              <Typography
                style={{marginTop: 9}}>{`${this.props.selectedIndex + 1} of ${this.props.images.length}`}</Typography>
            </Grid>
            <Grid item>
              <Button size="small" onClick={this.handleNext}
                      disabled={this.props.selectedIndex === this.props.images.length - 1}>
                {<KeyboardArrowRight/>}
              </Button>
            </Grid>
          </Grid>
          <GridList cellHeight={115} cols={6} style={{padding: '16px 0 32px 0'}}>
            {this.props.images.map((image, index) => (
              <GridListTile key={image.id} cols={1} style={{width: 115}}>
                <ButtonBase style={{height: 115, width: 115}}
                            onClick={this.handleImageSelected.bind(this, image, index)}>
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