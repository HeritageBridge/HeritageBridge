import React from "react";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import TargetResourceList from './TargetResourceList'
import LogoEamena from '../Svg/logo-eamena.svg'
import Svg from 'react-svg-inline'

export default class TargetResource extends React.Component {
  static defaultProps = {
    onSearch: (query) => {},
    onResourceSelected: (resource) => {},
    onResourceDeselected: (resource) => {},
    resources: [],
    selectedResource: null,
  }
  
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }
  
  handleResourceSearchChange = (event) => {
    this.setState({query: event.target.value})
  };
  
  handleResourceSearchEnter = () => {
    this.props.onSearch(this.state.query)
  };
  
  handleResourceSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleResourceSearchEnter()
    }
  };
  
  handleResourceSelected = (resource) => {
    this.props.onResourceSelected(resource)
  };
  
  handleResourceDeselected = (resource) => {
    this.props.onResourceDeselected(resource)
  };
  
  render() {
    return (
      <Paper style={{margin: '0 auto'}}>
        <div className="amal-target-resource" style={{minHeight: 100, padding: 32}}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Typography variant="subheading">EAMENA Resources</Typography>
            </Grid>
            <Grid item xs={6} style={{display: 'table-cell', verticalAlign: 'middle'}}>
              <Svg svg={LogoEamena} style={{ display: 'block', margin: '6px 0 0 auto', width: 69 }}/>
            </Grid>
          </Grid>
          <Grid container spacing={8} direction="column" style={{marginTop: 16}}>
            <Grid item xs={12}>
              <TextField
                placeholder="EAMENA-XXXXXX"
                onChange={this.handleResourceSearchChange}
                onKeyPress={this.handleResourceSearchKeyPress}
                style={{width: '100%'}}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined/>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TargetResourceList
                resources={this.props.resources}
                onSelect={this.handleResourceSelected}
                onDeselect={this.handleResourceDeselected}
                selectedResource={this.props.selectedResource}
              />
            </Grid>
          </Grid>
        </div>
      </Paper>
    )
  }
}
