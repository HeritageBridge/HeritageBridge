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
    sections: [],
    startDate: moment().subtract(3, "days").toDate(),
    endDate: moment().toDate(),
    onSelectionChanged: (selectedIndexes) => {},
    onDateRangeChanged: (startDate, endDate) => {},
  }
  
  componentWillReceiveProps(nextProps) {
    let selectedIndexes = []
    const {sections} = nextProps
    sections.map((s, i) => {
      selectedIndexes[i] = []
    })
    this.setState({selectedIndexes})
  }
  
  constructor(props) {
    super(props)
    
    let selectedIndexes = []
    const {sections} = props
    sections.map((s, i) => {
      selectedIndexes[i] = []
    })
    this.state = {
      selectedIndexes,
      startDate: props.startDate,
      endDate: props.endDate
    }
  }
  
  handleStartDateChanged = (startDate) => {
    this.setState({ startDate })
    this.props.onDateRangeChanged(startDate, this.state.endDate)
  }
  
  handleEndDateChanged = (endDate) => {
    this.setState({ endDate })
    this.props.onDateRangeChanged(this.state.startDate, endDate)
  }
  
  handleImageSectionToggle = (sectionIndex) => {
    const {sections} = this.props
    const section = sections[sectionIndex]
    let {selectedIndexes} = this.state
    if (section === undefined) {
      return
    } else if (this.isSectionAtIndexSelected(sectionIndex)) {
      selectedIndexes[sectionIndex] = []
    } else {
      selectedIndexes[sectionIndex] = section.images.map((image, index) => index)
    }
    this.setState({selectedIndexes})
    this.props.onSelectionChanged(selectedIndexes)
  }
  
  handleImageToggle = (image, index, sectionIndex) => {
    let {selectedIndexes} = this.state
    let currentSectionIndexes = selectedIndexes[sectionIndex]
    if (currentSectionIndexes === undefined) {
      selectedIndexes[sectionIndex] = []
      selectedIndexes[sectionIndex].push(index)
    } else if (bs(currentSectionIndexes, index, this.indexBinarySearchComparator) >= 0) {
      selectedIndexes[sectionIndex] = currentSectionIndexes.filter(i => i !== index)
    } else {
      currentSectionIndexes.push(index)
      currentSectionIndexes.sort(this.indexSortComparator)
      selectedIndexes[sectionIndex] = currentSectionIndexes
    }
    this.setState({selectedIndexes})
    this.props.onSelectionChanged(selectedIndexes)
  }
  
  isImageAtIndexSelected = (index, sectionIndex) => {
    const {selectedIndexes} = this.state
    const currentSectionIndexes = selectedIndexes[sectionIndex]
    if (currentSectionIndexes === undefined) {
      return false
    } else {
      return bs(currentSectionIndexes, index, this.indexBinarySearchComparator) >= 0
    }
  }
  
  isSectionAtIndexSelected = (sectionIndex) => {
    const {sections} = this.props
    const section = sections[sectionIndex]
    if (section === undefined) {
      return false
    }
    let {selectedIndexes} = this.state
    const currentSectionIndexes = selectedIndexes[sectionIndex]
    return section.images.length === currentSectionIndexes.length
  }
  
  render() {
    const {sections} = this.props
    return (
      <Paper style={{maxWidth: 608, margin: '0 auto'}}>
        <div className="amal-target-resource" style={{minHeight: 100, padding: 32}}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Typography variant="subheading">Amal in Heritage</Typography>
            </Grid>
            <Grid item xs={6} style={{display: 'table-cell', verticalAlign: 'middle'}}>
              <Svg svg={LogoAmalInHeritage} style={{ display: 'block', margin: '6px 0 0 auto', width: 48 }}/>
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item>
              <InlineDatePicker
                onlyCalendar
                keyboard
                format="D MMMM YYYY"
                label="Start Date"
                maxDate={this.state.endDate}
                value={this.state.startDate}
                onChange={(md) => this.handleStartDateChanged(md.toDate())}
              />
            </Grid>
            <Grid item>
              <InlineDatePicker
                onlyCalendar
                keyboard
                format="D MMMM YYYY"
                label="End Date"
                minDate={this.state.startDate}
                value={this.state.endDate}
                onChange={(md) => this.handleEndDateChanged(md.toDate())}
              />
            </Grid>
          </Grid>
          {sections.map((section, sectionIndex) => (
            <GridList key={section.date} cellHeight={115} cols={6}>
              <GridListTile cols={6} style={{height: 'auto'}}>
                <ListSubheader component="div" style={{padding: 0}}>
                  <Checkbox
                    color="primary"
                    onChange={this.handleImageSectionToggle.bind(this, sectionIndex)}
                    checked={this.isSectionAtIndexSelected(sectionIndex)}
                  />
                  {moment(section.date).format('D MMMM YYYY')}
                </ListSubheader>
              </GridListTile>
              {section.images.map((image, index) => (
                <GridListTile key={image.id} cols={1} style={{width: 115}}>
                  <ButtonBase style={{height: 115, width: 115}}
                              onClick={this.handleImageToggle.bind(this, image, index, sectionIndex)}>
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
                      opacity: this.isImageAtIndexSelected(index, sectionIndex) ? 0.75 : 1
                    }}/>
                    {this.isImageAtIndexSelected(index, sectionIndex) ?
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