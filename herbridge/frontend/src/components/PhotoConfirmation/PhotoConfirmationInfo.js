import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider';
import moment from 'moment'
import Typography from '@material-ui/core/Typography'

export default class extends React.Component {
  static defaultProps = {
    image: {
          id: 'e0000000-0000-0000-0000-000000000003',
          url: '/media/sample/_DSC1029.JPG',
          thumbnailUrl: '/media/CACHE/images/sample/_DSC1029/b029cbb1b40c510afb0f1564d2182895.JPG',
          latitude: 29.53477,
          longitude: 31.34325,
          captureDate: 1322579576,
          caption: null
        }
  }
  
  getListItem = (primaryText, secondaryText) => {
    const isSecondaryTextAvailable = secondaryText !== null && secondaryText !== undefined
    return (
        <ListItem>
          <ListItemText primary={primaryText}/>
          <ListItemText disableTypography>
            <Typography variant="body1" style={{ textAlign: 'end', color: isSecondaryTextAvailable ? "black" : "gray" }}>
              {isSecondaryTextAvailable ? secondaryText : "N/A"}
            </Typography>
          </ListItemText>
        </ListItem>
    )
  }
  
  render() {
    const { image } = this.props
    return (
      <List style={{ padding: '0 32px' }}>
        { this.getListItem("Captured", moment(image.captureDate*1000).format("D MMMM YYYY [at] h:mm a")) }
        <Divider/>
        { this.getListItem("Location", `${image.latitude}, ${image.longitude}`) }
        <Divider/>
        { this.getListItem("Caption", image.caption) }
      </List>
    )
  }
}