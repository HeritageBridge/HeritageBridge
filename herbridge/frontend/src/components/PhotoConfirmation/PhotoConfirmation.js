import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Collapse from '@material-ui/core/Collapse'
import Typography from "@material-ui/core/Typography/Typography";
import CheckCircleRounded from "@material-ui/icons/CheckCircleRounded"
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import PhotoConfirmationButtonGroup from './PhotoConfirmationButtonGroup'
import PhotoConfirmationInfo from './PhotoConfirmationInfo'
import SwipeableViews from 'react-swipeable-views';

export default class extends React.Component {
  static defaultProps = {
    images: [],
    selectedIndex: 0,
    onClear: (index) => {},
    onSelectionChanged: (index) => {},
  }
  
  state = {
    isShowingInfo: false
  }
  
  handleImageSelected = (image, index) => {
    this.props.onSelectionChanged(index)
  }
  
  handleImageIndexChanged = (index) => {
    this.props.onSelectionChanged(index)
  }
  
  handlePreviousImageSelected = () => {
    this.props.onSelectionChanged(this.props.selectedIndex - 1)
  }
  
  handleNextImageSelected = () => {
    this.props.onSelectionChanged(this.props.selectedIndex + 1)
  }
  
  isImageAtIndexSelected = (index) => {
    return this.props.selectedIndex === index
  }
  
  getCarousel = () => {
    const { images, selectedIndex } = this.props
    return (
      <div>
        <SwipeableViews
            index={selectedIndex}
            onChangeIndex={this.handleImageIndexChanged}
            enableMouseEvents={true}>
            {images.map(image => {
              return <img
                key={image.id}
                src={image.url}
                style={{
                  height: 456,
                  objectFit: 'cover',
                  overflow: 'hidden',
                  width: '100%',
                }}/>
            })}
          </SwipeableViews>
      </div>
    )
  }
  
  getCarouselControls = () => {
    const {selectedIndex, images} = this.props
    const imageCount = images.length
    return (
      <Grid
        container
        style={{width: 200, margin: '0 auto'}}>
        <Grid item>
          <Button
            size="small"
            onClick={this.handlePreviousImageSelected}
            disabled={imageCount === 0 || selectedIndex === 0}>
            {<KeyboardArrowLeft/>}
          </Button>
        </Grid>
        <Grid item>
          <Typography
            style={{marginTop: 9}}>{imageCount > 0 ? `${selectedIndex + 1} of ${imageCount}` : ``}</Typography>
        </Grid>
        <Grid item>
          <Button
            size="small"
            onClick={this.handleNextImageSelected}
            disabled={imageCount === 0 || selectedIndex === imageCount - 1}>
            {<KeyboardArrowRight/>}
          </Button>
        </Grid>
      </Grid>
    )
  }
  
  getGridList = () => {
    return (
      <div>
        <GridList cellHeight={115} cols={6} style={{padding: '16px 0 32px 0'}}>
          {this.props.images.map((image, index) => (
            <GridListTile key={image.id} cols={1} style={{width: 115}}>
              <ButtonBase
                style={{height: 115, width: 115}}
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
    )
  }
  
  getInfo = () => {
    const { isShowingInfo } = this.state
    const selectedImage = this.props.images[this.props.selectedIndex]
    return (
      <Collapse in={isShowingInfo}>
        <PhotoConfirmationInfo image={selectedImage}/>
      </Collapse>
    )
  };
  
  getMainContent = () => {
    return (
      <div>
        <PhotoConfirmationButtonGroup
          onClear={() => {
            this.props.onClear(this.props.selectedIndex)
          }}
          onShowInfo={() => {
            const shouldShowInfo = !this.state.isShowingInfo
            this.setState({ isShowingInfo: shouldShowInfo })
            console.log('on show info')
          }}
          onExpand={() => {
            const image = this.props.images[this.props.selectedIndex]
            window.open(image.url, '_blank');
          }}
          />
        { this.getCarousel() }
        { this.getCarouselControls() }
        { this.getInfo() }
        { this.getGridList() }
      </div>
    )
  }
  
  getEmptyStateContent = () => {
    return (
      <div>
        <PhotoConfirmationButtonGroup disabled/>
        <div style={{
          backgroundColor: '#F5F5F5',
          height: 452,
          objectFit: 'cover',
          overflow: 'hidden',
          width: '100%',
        }}/>
        { this.getCarouselControls() }
      </div>
    )
  }
  
  render() {
    const { images } = this.props
    return (
      <Paper style={{height: '100%', margin: '0 auto'}}>
        <div style={{minHeight: 100}}>
          <Typography variant="subheading" style={{padding: '24px'}}>Confirm</Typography>
          { images.length > 0 ?  this.getMainContent() : this.getEmptyStateContent() }
        </div>
      </Paper>
    )
  }
}