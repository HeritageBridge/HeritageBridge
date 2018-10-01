'use strict'

import React from 'react'
import Grid from "@material-ui/core/Grid/Grid";
import {InlineDatePicker} from "material-ui-pickers/DatePicker";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import Input from "@material-ui/core/Input/Input";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

export default class extends React.Component {
  static defaultProps = {
    startDate: new Date(),
    endDate: new Date(),
    onDateRangeChanged: (startDate, endDate) => {
    },
  }
  
  handleStartDateChanged = (startDate) => {
    this.props.onDateRangeChanged(startDate, this.props.endDate)
  }
  
  handleEndDateChanged = (endDate) => {
    this.props.onDateRangeChanged(this.props.startDate, endDate)
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
                value={["Archived"]}
                onChange={event => {
                  console.log('changed', event)
                }}
                input={<Input id="select-multiple-checkbox"/>}
                renderValue={selected => selected.join(',')}
                // MenuProps={MenuProps}
              >
                <MenuItem key={"Archived"} value={"Archived"}>
                  <Checkbox checked={false}/>
                  <ListItemText primary={"Archived"}/>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    )
  }
}