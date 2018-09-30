import React from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import moment from 'moment'
import Typography from '@material-ui/core/Typography'

export default class extends React.Component {
  static MAX_HEIGHT_SM = 156
  static MAX_HEIGHT_XS = 276
  
  static defaultProps = {
    imageCount: 0,
    isLoading: false,
    resource: null,
    onArchive: () => {
    },
    onSubmit: () => {
    },
  }
  
  getCurrentDate = () => {
    return moment().format("ddd[,] D MMM YYYY [at] h:mm")
  }
  
  getMainContent = () => {
    const {
      imageCount,
      isLoading,
      onArchive,
      onSubmit,
      resource
    } = this.props
    const buttonStyle = {
      pointerEvents: isLoading ? 'none' : 'auto',
      margin: 'auto 0',
      width: '100%',
    }
    return (
      <Grid
        container
        spacing={24}
        direction="row"
        style={{
          opacity: isLoading ? 0.4 : 1,
          padding: '8px 16px',
          transition: 'opacity 300ms',
        }}>
        <Grid
          item
          xs={12}
          sm={5}>
          <Grid
            container
            direction="column">
            <Grid item>
              <Typography variant="body2">EAMENA-{resource ? resource.id : 'XXXXXX'}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="headline">{imageCount} selected</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">{this.getCurrentDate()}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={2}
          style={{display: 'flex'}}>
          <Button
            color="default"
            onClick={onArchive}
            style={buttonStyle}>Archive</Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={5}
          style={{display: 'flex'}}>
          <Button
            color="primary"
            variant="raised"
            onClick={onSubmit}
            style={buttonStyle}>Submit & Archive</Button>
        </Grid>
      </Grid>
    )
  }
  
  getLoadingContent = () => {
    return (
      <div style={{position: 'absolute', top: '25%', width: '100%'}}>
        <CircularProgress size={50} style={{display: 'block', margin: '0 auto'}}/>
      </div>
    )
  }
  
  render() {
    const {isLoading} = this.props
    return (
      <div style={Object.assign({
        backgroundColor: '#939393',
        boxShadow: '0px -2px 2px rgba(0,0,0,0.12)',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1
      }, this.props.style)}>
        <div style={{padding: 32}}>
          <Paper
            style={{
              width: 'fit-content',
              display: 'block',
              margin: '0 auto',
              position: 'relative'
            }}>
            {this.getMainContent()}
            {isLoading ? this.getLoadingContent() : null}
          </Paper>
        </div>
      </div>
    )
  }
}