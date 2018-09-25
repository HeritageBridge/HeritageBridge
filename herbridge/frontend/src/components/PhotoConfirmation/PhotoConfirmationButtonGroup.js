import React from 'react'
import ButtonBase from '@material-ui/core/ButtonBase'
import Grid from '@material-ui/core/Grid'
import ImageSearch from '@material-ui/icons/ImageSearch'
import Clear from '@material-ui/icons/Clear'
import Info from '@material-ui/icons/Info'

export default class extends React.Component {
  static defaultProps = {
    disabled: false,
    onClear: () => {},
    onExpand: () => {},
    onShowInfo: () => {},
  }
  
  getButtonWithIcon = (icon, action) => {
    const {disabled} = this.props
    return (
      <ButtonBase
        onClick={action}
        disabled={disabled}
        style={{
          backgroundColor: '#FFFFFF',
          opacity: disabled ? 0.4 : 1,
          padding: 12,
        }}>
        { icon }
      </ButtonBase>
    )
  }
  
  getDivider = () => {
    return <div style={{
      width: 1,
      height: '100%',
      backgroundColor: '#F3F3F3',
    }} />
  }
  
  render() {
    return (
      <div style={{
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          border: '1px solid #D7D7D7',
          borderRadius: 5,
          display: 'inline-block',
          overflow: 'hidden',
          position: 'absolute',
          right: 16,
          top: 16,
        }}>
          <Grid container>
            <Grid item>
              { this.getButtonWithIcon(<ImageSearch/>, this.props.onExpand) }
            </Grid>
            <Grid item>
              { this.getDivider() }
            </Grid>
            <Grid item>
              { this.getButtonWithIcon(<Info/>, this.props.onShowInfo) }
            </Grid>
            <Grid item>
              { this.getDivider() }
            </Grid>
            <Grid item>
              { this.getButtonWithIcon(<Clear/>, this.props.onClear) }
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}