'use strict'

import React from 'react'
import Grid from "@material-ui/core/Grid/Grid";
import {InlineDatePicker} from "material-ui-pickers/DatePicker";

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
        </Grid>
      </div>
    )
  }
}