'use strict'

import React from 'react'
import Grid from "@material-ui/core/Grid/Grid";
import {InlineDatePicker} from "material-ui-pickers/DatePicker";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ArchiveOutlined from '@material-ui/icons/ArchiveOutlined';
import Checkbox from '@material-ui/core/Checkbox'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default class extends React.Component {
  static defaultProps = {
    startDate: new Date(),
    endDate: new Date(),
    onDateRangeChanged: (startDate, endDate) => {
    },
  }
  
  state = {
    selectedValues: [],
    values: [
      "Show Archived"
    ]
  }
  
  handleStartDateChanged = (startDate) => {
    this.props.onDateRangeChanged(startDate, this.props.endDate)
  }
  
  handleEndDateChanged = (endDate) => {
    this.props.onDateRangeChanged(this.props.startDate, endDate)
  }
  
  handleFilterChange = (event) => {
    const values = this.state.values
    const value = event.target.value[0]
    const index = values.indexOf(value)
    console.log('selected', value, index)
  }
  
  getFilterRenderedValue = (selected) => {
    return selected.join(',')
  }
  
  render() {
    return (
      <div>
        <Grid container spacing={16}>
          <Grid item>
            <InlineDatePicker
              onlyCalendar
              keyboard
              format="D MMMM YYYY"
              label="Start Date"
              maxDate={this.props.endDate}
              value={this.props.startDate}
              onChange={(md) => this.handleStartDateChanged(md.toDate())}
            />
          </Grid>
          <Grid item>
            <InlineDatePicker
              onlyCalendar
              keyboard
              format="D MMMM YYYY"
              label="End Date"
              minDate={this.props.startDate}
              value={this.props.endDate}
              onChange={(md) => this.handleEndDateChanged(md.toDate())}
            />
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="select-multiple-checkbox">Filter</InputLabel>
              <Select
                multiple
                value={this.state.selectedValues}
                onChange={this.handleFilterChange}
                input={<Input id="select-multiple-checkbox"/>}
                renderValue={selected => selected.join(', ')}
                MenuProps={MenuProps}>
                <MenuItem value={"archived"}>
                  <Checkbox checked={this.state.isArchiveEnabled}/>
                  <ListItemText primary={"Show Archived"}/>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    )
  }
}