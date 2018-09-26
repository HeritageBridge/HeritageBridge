import React from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'

export default class extends React.Component {
  static defaultProps = {
    imageCount: 0,
    resourceId: 0,
  }
  
  render() {
    return (
      <div style={{
        backgroundColor: '#939393',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1
      }}>
        <div style={{padding: 32}}>
          <Paper style={{width: 'fit-content', display: 'block', margin: '0 auto'}}>
            <Grid container spacing={8} direction="row" style={{padding: '8px 16px'}}>
              <Grid item xs={12} sm={5}>
                <Grid container direction="column">
                  <Grid item>
                    <Typography variant="body2">EAMENA-{this.props.resourceId}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="headline">{this.props.imageCount} selected</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">{moment().format("ddd[,] D MMM YYYY [at] h:ss")}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={2} style={{display: 'flex'}}>
                <Button color="default" style={{margin: 'auto 0', width: '100%'}}>Archive</Button>
              </Grid>
              <Grid item xs={12} sm={5} style={{display: 'flex'}}>
                <Button color="primary" variant="raised" style={{margin: 'auto 0', width: '100%'}}>Submit & Archive</Button>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
    )
  }
}